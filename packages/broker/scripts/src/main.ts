import { createServer as createHttpServer } from 'http'
import { createServer as createNetServer } from 'net'

import Aedes from 'aedes'
import axios from "axios"
import { importJWK, jwtVerify, JWK, KeyLike } from 'jose'
import { exec } from 'mqtt-pattern'
import { IsNull } from 'typeorm'
import { createWebSocketStream, WebSocketServer } from 'ws'

import { ProductMessage } from 'productboard-common'
import { Database, compileProductMessage, compileUserMessage } from 'productboard-database'

type Index<T> = { [key: string]: T }

// Variables

let JWT_PUBLIC_KEY: KeyLike | Uint8Array // Load JWT public key from Nest.js backend later!

// Constants

const NET_PORT = 3003
const HTTP_PORT = 3004

const CLIENT_USER_IDS: Index<string> = {} // Remember user ID of each MQTT client
const PRODUCT_PUBLIC: Index<boolean> = {} // Remember product public flag
const PRODUCT_MEMBERS: Index<Index<boolean>> = {} // Remember product members list

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
                // Verify JWT (throws exception if not valid!)
                const result = await jwtVerify(username, JWT_PUBLIC_KEY)
                // Parse user ID from token payload
                const payload = result.payload as { userId: string }
                const userId = payload.userId
                // Remember user ID of MQTT client
                CLIENT_USER_IDS[client.id] = userId
                // Allow authenticate
                callback(null, true)
            } else {
                // Remember user ID of MQTT client
                CLIENT_USER_IDS[client.id] = null
                // Allow authenticate
                callback(null, true)
            }
        } catch (e) {
            console.error('Authenticate exception', e)
            // Deny authenticate
            callback(e, false)
        }
    }

    // MQTT Broker - Authorize

    aedes.authorizeSubscribe = async (client, subscription, callback) => {
        try {
            console.log('authorizeSubscribe', client.id, subscription.topic)
            // User topics do not require any further action
            const userMatch = exec('/users/+userId', subscription.topic)
            if (userMatch) {
                // Parse topic
                const userId = userMatch.userId
                // Schedule initialization
                setTimeout(async () => {
                    const users = await Database.get().userRepository.findBy({ userId, deleted: IsNull() })
                    const message = compileUserMessage({ users })
                    client.publish({
                        cmd: 'publish',
                        dup: false,
                        payload: JSON.stringify(message),
                        qos: 0,
                        retain: false,
                        topic: subscription.topic
                    })
                }, 0)
                // Allow subscribe
                return callback(null, subscription)
            }
            // For product topics, the product data has to be loaded
            const productMatch = exec('/products/+productId', subscription.topic)
            if (productMatch) {
                // Parse topic
                const productId = productMatch.productId
                // Load product public
                if (!(productId in PRODUCT_PUBLIC)) {
                    const product = await Database.get().productRepository.findOneByOrFail({ productId, deleted: IsNull() })
                    PRODUCT_PUBLIC[productId] = product.public
                }
                // Load product members
                if (!(productId in PRODUCT_MEMBERS)) {
                    const members = await Database.get().memberRepository.findBy({ productId, deleted: IsNull() })
                    PRODUCT_MEMBERS[productId] = {}
                    for (const member of members) {
                        PRODUCT_MEMBERS[productId][member.userId] = true
                    }
                }
                // Schedule initialization
                const userId = CLIENT_USER_IDS[client.id]
                if (PRODUCT_PUBLIC[productId] || PRODUCT_MEMBERS[productId][userId]) {
                    setTimeout(async () => {
                        const products = await Database.get().productRepository.findBy({ productId, deleted: IsNull() })
                        const members = await Database.get().memberRepository.findBy({ productId, deleted: IsNull() })
                        const issues = await Database.get().issueRepository.findBy({ productId, deleted: IsNull() })
                        const comments = await Database.get().commentRepository.findBy({ productId, deleted: IsNull() })
                        const milestones = await Database.get().milestoneRepository.findBy({ productId, deleted: IsNull() })
                        const versions = await Database.get().versionRepository.findBy({ productId, deleted: IsNull() })
                        const message = compileProductMessage({ products, members, issues, comments, milestones, versions })
                        client.publish({
                            cmd: 'publish',
                            dup: false,
                            payload: JSON.stringify(message),
                            qos: 0,
                            retain: false,
                            topic: subscription.topic
                        })
                    }, 0)
                }
                // Allow subscribe
                return callback(null, subscription)
            }
            // Deny subscribe
            return callback(new Error('Topic does not exist'), null)
        } catch (e) {
            console.error('Authorize subscribe exception', e)
            // Deny subscribe
            return callback(e, null)
        }
    }
    
    aedes.authorizePublish = async (client, packet, callback) => {
        console.log('authorizePublish', client.id, packet.topic)
        // Only backend can publish messages!
        if (CLIENT_USER_IDS[client.id] == 'backend') {
            // Allow publish
            callback(null)
            // Update product public
            const productMatch = exec('/products/+productId', packet.topic)
            if (productMatch) {
                // Parse topic and payload
                const productId = productMatch.productId
                const productMessage = JSON.parse(packet.payload.toString()) as ProductMessage
                // Update product public
                if (productMessage.products && productId in productMessage.products) {
                    const product = productMessage.products[productId]
                    PRODUCT_PUBLIC[productId] = product.public
                }
                // Update product members
                if (productId in PRODUCT_MEMBERS && productMessage.members) {
                    for (const memberId in productMessage.members) {
                        const member = productMessage.members[memberId]
                        PRODUCT_MEMBERS[productId][member.userId] = !member.deleted
                    }
                }
            }
        } else {
            // Deny publish
            callback(new Error('You are not allowed to publish'))
        }
    }

    aedes.authorizeForward = (client, packet) => {
        console.log('authorizeForward', client.id, packet.topic)
        // User topics can be forwarded without further checks
        const userMatch = exec('/products/+userId', packet.topic)
        if (userMatch) {
            // Allow forward
            return packet
        }
        // Product topics have to be checked more carefully
        const productMatch = exec('/products/+productId', packet.topic)
        if (productMatch) {
            // Check product public
            const productId = productMatch.productId
            if (PRODUCT_PUBLIC[productId]) {
                // Allow forward
                return packet
            }
            // Check product members
            const userId = CLIENT_USER_IDS[client.id]
            if (PRODUCT_MEMBERS[productId][userId]) {
                // Allow forward
                return packet
            }
            // Deny forward
            return null
        }
        // Deny forward
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