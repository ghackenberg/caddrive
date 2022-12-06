import { VersionDownMQTT, VersionUpMQTT, Version } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class VersionClient extends AbstractClient<VersionDownMQTT> implements VersionUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/versions/+/create", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/versions/+/update", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/versions/+/delete", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })

        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('/api/v1/versions')) {
                const version = JSON.parse(message.toString()).data as Version
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(version)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(version)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(version)
                    }
                }
            }
        })
    }
}

export const VersionAPI = new VersionClient()