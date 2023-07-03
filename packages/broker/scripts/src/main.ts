import { createServer as createHttpServer } from 'http'
import { createServer as createNetServer } from 'net'

import Aedes from 'aedes'
import axios from "axios"
import { importJWK, jwtVerify, JWK, KeyLike } from 'jose'
import { exec } from 'mqtt-pattern'
import { IsNull } from 'typeorm'
import { createWebSocketStream, WebSocketServer } from 'ws'

import { Member, Product } from 'productboard-common'
import { Database } from 'productboard-database'

// Variables

let JWT_PUBLIC_KEY: KeyLike | Uint8Array // Load JWT public key from Nest.js backend later!

// Constants

const NET_PORT = 3003
const HTTP_PORT = 3004

const CLIENT_USER_IDS: { [clientId: string]: string } = {} // Remember user ID of each MQTT client!

const PRODUCT_CACHE: { [productId: string]: boolean } = {}

const PRODUCT_MEMBER_CACHE: { [productId: string]: string[] }= {}

// Functions

async function boot() {
    // Database

    await Database.init()

    // MQTT Broker

    const aedes = new Aedes()

    // MQTT Broker - Authenticate

    aedes.authenticate = async (client, username, _password, callback) => {
        try {
            console.log('authenticate', client.id)
            if (username) {
                // Load JWT public key from Nest.js backend if necessary!
                if (!JWT_PUBLIC_KEY) {
                    const request = axios.get<JWK>('http://localhost:3001/rest/keys')
                    const response = await request
                    JWT_PUBLIC_KEY = await importJWK(response.data, "PS256")
                }
                // Verify JWT
                const result = await jwtVerify(username, JWT_PUBLIC_KEY)
                // Remember user ID of MQTT client!
                const payload = result.payload as { userId: string }
                const userId = payload.userId
                CLIENT_USER_IDS[client.id] = userId
                // Success
                callback(null, true)
            } else {
                CLIENT_USER_IDS[client.id] = null
                callback(null, true)
            }
        } catch (e) {
            callback(e, false)
        }
    }

    // MQTT Broker - Authorize

    aedes.authorizeSubscribe = async (client, subscription, callback) => {
        try {
            console.log('authorizeSubscribe', client.id, subscription.topic)
            // User topics are visible to everybody
            const userMatch = exec('/users/+userId', subscription.topic)
            if (userMatch) {
                return callback(null, subscription)
            }
            // Product topics have to be checked more carefully
            const productMatch = exec('/products/#path', subscription.topic)
            if (productMatch) {
                // Load data
                const productId = productMatch.path[0]
                // Load product
                if (!(productId in PRODUCT_CACHE)) {
                    const product = await Database.get().productRepository.findOneByOrFail({ productId, deleted: IsNull() })
                    PRODUCT_CACHE[productId] = product.public
                }
                // Load product members
                if (!(productId in PRODUCT_MEMBER_CACHE)) {
                    const members = await Database.get().memberRepository.findBy({ productId, deleted: IsNull() })
                    PRODUCT_MEMBER_CACHE[productId] = members.map(member => member.userId)
                }
                // Check permission
                const userId = CLIENT_USER_IDS[client.id]
                // Public product topics are visible to everybody
                if (PRODUCT_CACHE[productId]) {
                    return callback(null, subscription)
                }
                // Non-public product topics are visible to product members only
                if (PRODUCT_MEMBER_CACHE[productId].indexOf(userId) != -1) {
                    return callback(null, subscription)
                }
                console.log('Product not allowed')
                return callback(new Error('Product not allowed!'), null)
            }
            // Other topics do not exist
            console.log('Topic not allowed')
            return callback(new Error('Topic not supported!'), null)
        } catch (e) {
            console.log('Other not allowed', e)
            return callback(e, null)
        }
    }
    aedes.authorizePublish = async (client, packet, callback) => {
        console.log('authorizePublish', client.id, packet.topic)
        // Only backend can publish messages!
        if (CLIENT_USER_IDS[client.id] == 'backend') {
            // Allow publishing
            callback(null)
            // Update product cache
            const productMatch = exec('/products/+productId', packet.topic)
            if (productMatch) {
                const productId = productMatch.productId
                const product = JSON.parse(packet.payload.toString()) as Product
                PRODUCT_CACHE[productId] = product.public
            }
            // Update product member cache
            const memberMatch = exec('/products/+productId/members/+memberId', packet.topic)
            if (memberMatch) {
                const productId = memberMatch.productId
                if (productId in PRODUCT_MEMBER_CACHE) {
                    const member = JSON.parse(packet.payload.toString()) as Member
                    if (member.deleted) {
                        const userId = member.userId
                        PRODUCT_MEMBER_CACHE[productId].splice(PRODUCT_MEMBER_CACHE[productId].indexOf(userId), 1)
                    }
                }
            }
        } else {
            callback(new Error('Only backend can publish!'))
        }
    }
    aedes.authorizeForward = (client, packet) => {
        console.log('authorizeForward', client.id, packet.topic)
        // User topics can be forwarded without further checks
        const userMatch = exec('/products/+userId', packet.topic)
        if (userMatch) {
            return packet
        }
        // Product topics have to be checked more carefully
        const productMatch = exec('/products/#path', packet.topic)
        if (productMatch) {
            // Check product cache
            const productId = productMatch.path[0]
            if (PRODUCT_CACHE[productId]) {
                return packet
            }
            // Check product member cache
            const userId = CLIENT_USER_IDS[client.id]
            if (PRODUCT_MEMBER_CACHE[productId].indexOf(userId) != -1) {
                return packet
            }
            return null
        }
        // Other topics do not exist
        return null
    }

    // MQTT Broker - Events

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
        delete CLIENT_USER_IDS[client.id]
    })

    // Net server

    const netServer = createNetServer(aedes.handle)
    netServer.listen(NET_PORT, () => {
        console.log('NET server listening')
    })

    // HTTP server

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
}

// Calls

boot()