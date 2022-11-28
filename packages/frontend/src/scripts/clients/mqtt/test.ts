import { TestDownMQTT, TestUpMQTT } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class TestClient extends AbstractClient<TestDownMQTT> implements TestUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("c", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("d", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        // Handle
        client.on('message', (topic, message) => {
            console.log('MQTT client message', topic, message)
            if (topic == "c") {
                for (const handler of this.handlers) {
                    handler.c(message.toString())
                }
            } else if (topic == "d") {
                for (const handler of this.handlers) {
                    handler.d(message.toString())
                }
            }
        })
    }
    async a(data: string) {
        client.publish('a', data)
    }
    async b(data: string) {
        client.publish('b', data)
    }
}

export const TestAPI = new TestClient()