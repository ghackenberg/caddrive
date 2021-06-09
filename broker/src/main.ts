import * as http from 'http'
import * as websocket from 'websocket-stream'
import aedes from 'aedes'

const mqtt = aedes()

mqtt.on('client', client => console.log('client', client))
mqtt.on('clientReady', client => console.log('clientReady', client))
mqtt.on('clientDisconnect', client => console.log('clientDisconnect', client))
mqtt.on('clientError', (client, error) => console.log('clientError', client, error))
mqtt.on('connectionError', (client, error) => console.log('connectionError', client, error))
mqtt.on('keepaliveTimeout', client => console.log('keepaliveTimeout', client))
mqtt.on('publish', (packet, client) => console.log('publish', packet, client))
mqtt.on('ack', (packet, client) => console.log('ack', packet, client))
mqtt.on('ping', (packet, client) => console.log('ping', packet, client))
mqtt.on('subscribe', (subscriptions, client) => console.log('subscribe', subscriptions, client))
mqtt.on('unsubscribe', (unsubscriptions, client) => console.log('unsubscribe', unsubscriptions, client))
mqtt.on('connackSent', (packet, client) => console.log('connackSent', packet, client))
mqtt.on('closed', () => console.log('closed'))

const server = http.createServer()

websocket.createServer({ server }, <any> mqtt.handle)

server.listen(3004)