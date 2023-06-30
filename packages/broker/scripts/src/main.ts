import { createServer as createHttpServer } from 'http'
import { createServer as createNetServer } from 'net'

import Aedes from 'aedes'
import { createWebSocketStream, WebSocketServer } from 'ws'

const NET_PORT = 3003
const HTTP_PORT = 3004

// MQTT Broker

const aedes = new Aedes()
aedes.authenticate = (client, username, password, callback) => {
    console.log('authenticate', client, username, password)
    callback(null, true)
}
aedes.authorizePublish = (client, packet, callback) => {
    console.log('authorizePublish', client, packet)
    callback(null)
}
aedes.authorizeSubscribe = (client, subscription, callback) => {
    console.log('authorizeSubscribe', client, subscription)
    callback(null, subscription)
}
aedes.authorizeForward = (client, packet) => {
    console.log('authorizeForward', client, packet)
    return packet
}

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