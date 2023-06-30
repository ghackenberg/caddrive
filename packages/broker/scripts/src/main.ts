import { createServer as createHttpServer } from 'http'
import { createServer as createNetServer } from 'net'

import Aedes from 'aedes'
import axios from "axios"
import { importJWK, jwtVerify, JWK, KeyLike } from 'jose'
import { createWebSocketStream, WebSocketServer } from 'ws'

// Variables

let key: KeyLike | Uint8Array

// Constants

const KEY_DATA = axios.get<JWK>('http://localhost:3001/rest/keys')

const NET_PORT = 3003
const HTTP_PORT = 3004

const USER_IDS: { [clientId: string]: string } = {}

// Contants - MQTT Broker

const aedes = new Aedes()
aedes.authenticate = async (client, username, password, callback) => {
    console.log('authneticate', client.id, username, password)
    try {
        if (username) {
            key = key || await importJWK((await KEY_DATA).data, "PS256")
            const result = await jwtVerify(username, key)
            const payload = result.payload as { userId: string }
            const userId = payload.userId
            USER_IDS[client.id] = userId
            callback(null, true)
        } else {
            USER_IDS[client.id] = null
            callback(null, true)
        }
    } catch (e) {
        callback(e, false)
    }
}
aedes.authorizePublish = async (client, packet, callback) => {
    console.log('authorizePublish', client.id, packet.topic)
    callback(null)
}
aedes.authorizeSubscribe = async (client, subscription, callback) => {
    console.log('authorizeSubscribe', client.id, subscription.topic)
    callback(null, subscription)
}
aedes.authorizeForward = (client, packet) => {
    console.log('authorizeForward', client.id, packet.topic)
    return packet
}
aedes.on('clientDisconnect', async client => {
    console.log('clientDisconnect', client.id)
    delete USER_IDS[client.id]
})

// Contants - Net server

const netServer = createNetServer(aedes.handle)
netServer.listen(NET_PORT, () => {
    console.log('NET server listening')
})

// Contants - HTTP server

const httpServer = createHttpServer()
httpServer.listen(HTTP_PORT, () => {
    console.log('HTTP server listening')
})

// WebSocket server

const wsServer = new WebSocketServer({ server: httpServer })
wsServer.on('connection', socket => {
    const stream = createWebSocketStream(socket)
    aedes.handle(stream)
})