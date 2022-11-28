import * as net from 'net'

import Aedes from 'aedes'
import websocketStream from 'websocket-stream'

// Set-up MQTT broker
const aedes = new Aedes()
aedes.on('client', client => {
    console.log('Client connect', client.id)
})
aedes.on('clientDisconnect', client => {
    console.log('Client disconnect', client.id)
})
aedes.on('clientReady', client => {
    console.log('Client ready', client.id)
})
aedes.on('clientError', (client, error) => {
    console.error('Client error', client.id, error)
})
aedes.on('subscribe', (subscriptions, client) => {
    console.log('Client subscribe', client.id, subscriptions)
})
aedes.on('unsubscribe', (unsubscriptions, client) => {
    console.log('Client unsubscribe', client.id, unsubscriptions)
})

// Handle TCP connections
const tcp = net.createServer()
tcp.on('connection', stream => {
    aedes.handle(stream, null)
})
tcp.listen(1883)

// Handle WebSocket connections
const web = websocketStream.createServer({ port: 3004 })
web.on('connection', socket => {
    aedes.handle(websocketStream(socket), null)
})