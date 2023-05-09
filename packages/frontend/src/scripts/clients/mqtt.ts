import * as mqtt from 'mqtt'

import { auth } from './auth'

const protocol = window.location.protocol == 'http:' ? 'ws:' : 'wss:'
const host = window.location.host
const path = 'mqtt'
const url =`${protocol}//${host}/${path}`

// TODO create MQTT client after Auth0 login

export const client = mqtt.connect(url, {
    wsOptions: {
        ...auth
    }
})

client.on('connect', () => {
    console.log('MQTT client connected')
    client.subscribe('#', error => {
        if (error) {
            console.error(error)
        }
    })
})
client.on('disconnect', () => {
    console.log('MQTT client disconnected')
})
client.on('close', () => {
    console.log('MQTT client closed')
})
client.on('end', () => {
    console.log('MQTT client end')
})
client.on('offline', () => {
    console.log('MQTT client offline')
})
client.on('reconnect', () => {
    console.log('MQTT client reconnect')
})
client.on('error', error => {
    console.error('MQTT client error', error)
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
client.on('message', topic => {
    console.log(`MQTT client message`, topic)
})