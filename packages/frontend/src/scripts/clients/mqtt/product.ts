import { ProductDownMQTT, ProductUpMQTT, Product } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class ProductClient extends AbstractClient<ProductDownMQTT> implements ProductUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/products/+/create", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/products/+/update", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/products/+/delete", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })

        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('/api/v1/products')) {
                const product = JSON.parse(message.toString()).data as Product
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(product)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(product)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(product)
                    }
                }
            }
        })
    }
}

export const ProductAPI = new ProductClient()