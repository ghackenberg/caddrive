import * as mqtt from 'mqtt'
// Commons
import { TestMQTT } from 'productboard-common'

const protocol = window.location.protocol == 'http:' ? 'ws:' : 'wss:'
const host = window.location.host
const path = 'mqtt'
const url =`${protocol}//${host}/${path}`

const client = mqtt.connect(url)

console.log(client)

class TestClient implements TestMQTT {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async a(_data: string) {
        //client.publish('a', data)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async b(_data: string) {
        //client.publish('b', data)
    }
}

export const TestAPI = new TestClient()