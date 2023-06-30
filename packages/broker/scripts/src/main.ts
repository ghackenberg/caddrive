import { createServer as createHttpServer } from 'http'
import { createServer as createNetServer } from 'net'

import Aedes from 'aedes'
import axios from "axios"
import { importJWK, jwtVerify, JWK, KeyLike } from 'jose'
import { exec } from 'mqtt-pattern'
import { IsNull } from 'typeorm'
import { createWebSocketStream, WebSocketServer } from 'ws'

import { Database } from 'productboard-database'

// Variables

let key: KeyLike | Uint8Array

// Constants

const NET_PORT = 3003
const HTTP_PORT = 3004

const USER_IDS: { [clientId: string]: string } = {}

// Contants - MQTT Broker

const aedes = new Aedes()
aedes.authenticate = async (client, username, _password, callback) => {
    console.log('authneticate', client.id)
    try {
        if (username) {
            if (!key) {
                const request = axios.get<JWK>('http://localhost:3001/rest/keys')
                const response = await request
                key = await importJWK(response.data, "PS256")
            }
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
aedes.authorizeSubscribe = async (client, subscription, callback) => {
    console.log('authorizeSubscribe', client.id, subscription.topic)
    try {
        // User topics are fine for everybody
        const userMatch = exec('/users/+id', subscription.topic)
        if (userMatch) {
            return callback(null, subscription)
        }
        // Product topics have to be checked more carefully
        const productMatch = exec('/products/#path', subscription.topic)
        if (productMatch) {
            // Public product topics are fine for everybody again
            const id = productMatch.path[0]
            const product = await Database.get().productRepository.findOneByOrFail({ id, deleted: IsNull() })
            if (product.public) {
                return callback(null, subscription)
            }
            // Non-public product topics require product membership
            await Database.get().memberRepository.findOneByOrFail({ productId: id, userId: USER_IDS[client.id], deleted: IsNull() })
            return callback(null, subscription)
        }
        // Other topics do not exist
        callback(new Error('Topic not supported!'), null)
    } catch (e) {
        callback(e, null)
    }
}
aedes.authorizePublish = async (client, packet, callback) => {
    console.log('authorizePublish', client.id, packet.topic)
    if (USER_IDS[client.id] == 'backend') {
        callback(null)
    } else {
        callback(new Error('Only backend can publish!'))
    }
}
aedes.authorizeForward = (client, packet) => {
    console.log('authorizeForward', client.id, packet.topic)
    return packet
}
aedes.on('subscribe', (subscriptions, client) => {
    console.log('subscribe', client.id, subscriptions[0].topic)
})
aedes.on('unsubscribe', (unsubscriptions, client) => {
    console.log('unsubscribe', client.id, unsubscriptions[0])
})
aedes.on('publish', (packet, client) => {
    if (client) {
        console.log('publish', client.id, packet.topic)
    }
})
aedes.on('clientDisconnect', client => {
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