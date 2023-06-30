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

let PUBLIC_KEY: KeyLike | Uint8Array // Load JWT public key from Nest.js backend later!

// Constants

const NET_PORT = 3003
const HTTP_PORT = 3004

const USER_IDS: { [clientId: string]: string } = {} // Remember user ID of each MQTT client!

// Constants - MQTT Broker

const aedes = new Aedes()

// Constants - MQTT Broker - Authenticate

aedes.authenticate = async (client, username, _password, callback) => {
    try {
        console.log('authenticate', client.id)
        if (username) {
            // Load JWT public key from Nest.js backend if necessary!
            if (!PUBLIC_KEY) {
                const request = axios.get<JWK>('http://localhost:3001/rest/keys')
                const response = await request
                PUBLIC_KEY = await importJWK(response.data, "PS256")
            }
            // Verify JWT
            const result = await jwtVerify(username, PUBLIC_KEY)
            // Remember user ID of MQTT client!
            const payload = result.payload as { userId: string }
            const userId = payload.userId
            USER_IDS[client.id] = userId
            // Success
            callback(null, true)
        } else {
            USER_IDS[client.id] = null
            callback(null, true)
        }
    } catch (e) {
        callback(e, false)
    }
}

// Constants - MQTT Broker - Authorize

aedes.authorizeSubscribe = async (client, subscription, callback) => {
    try {
        console.log('authorizeSubscribe', client.id, subscription.topic)
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

// Constants - MQTT Broker - Events

aedes.on('subscribe', (subscriptions, client) => {
    console.log('subscribe', client.id, subscriptions[0].topic)
})
aedes.on('unsubscribe', (unsubscriptions, client) => {
    console.log('unsubscribe', client.id, unsubscriptions[0])
})
aedes.on('publish', (packet, client) => {
    client && console.log('publish', client.id, packet.topic)
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