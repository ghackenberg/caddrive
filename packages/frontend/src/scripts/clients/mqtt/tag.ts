import { TagDownMQTT, TagUpMQTT, Tag } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class TagClient extends AbstractClient<TagDownMQTT> implements TagUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/tags/+/create", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/tags/+/update", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/tags/+/delete", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })

        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('/api/v1/tags')) {
                const tag = JSON.parse(message.toString()).data as Tag
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(tag)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(tag)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(tag)
                    }
                }
            }
        })
    }
}

export const TagAPI = new TagClient()