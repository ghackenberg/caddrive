import { TestDownMQTT, TestUpMQTT } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class TestClient extends AbstractClient<TestDownMQTT> implements TestUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("c")
        client.subscribe("d")
        // Handle
        client.on('message', (topic, message) => {
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