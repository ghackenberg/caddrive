import * as mqtt from 'mqtt'
// Commons
import { TestMQTT } from 'fhooe-audit-platform-common'

const protocol = window.location.protocol == 'http:' ? 'ws:' : 'wss:'
const host = window.location.host
const path = 'mqtt'
const url =`${protocol}//${host}/${path}`

const client = mqtt.connect(url)

console.log(client)

class TestClient implements TestMQTT {
    async a(_data: string) {
        //client.publish('a', data)
    }
    async b(_data: string) {
        //client.publish('b', data)
    }
}

export const TestAPI = new TestClient()