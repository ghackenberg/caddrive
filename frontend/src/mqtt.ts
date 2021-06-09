import * as mqtt from 'mqtt'
import { TestMQTT } from 'fhooe-audit-platform-common'

const client = mqtt.connect('ws://localhost:3000/mqtt')

class TestClient implements TestMQTT {
    async a(data: string) {
        client.publish('a', data)
    }
    async b(data: string) {
        client.publish('b', data)
    }
}

export const TestAPI = new TestClient()