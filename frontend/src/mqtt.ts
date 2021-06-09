import * as mqtt from 'mqtt'
import { TestMQTT } from 'fhooe-audit-platform-common'

const protocol = window.location.protocol == 'http:' ? 'ws:' : 'wss:'
const host = window.location.host
const path = 'mqtt'
const url =`${protocol}//${host}/${path}`

const client = mqtt.connect(url)

class TestClient implements TestMQTT {
    async a(data: string) {
        client.publish('a', data)
    }
    async b(data: string) {
        client.publish('b', data)
    }
}

export const TestAPI = new TestClient()