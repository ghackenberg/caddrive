import * as mqtt from 'mqtt'

const protocol = window.location.protocol == 'http:' ? 'ws:' : 'wss:'
const host = window.location.host
const path = 'mqtt'
const url =`${protocol}//${host}/${path}`

export const client = mqtt.connect(url)