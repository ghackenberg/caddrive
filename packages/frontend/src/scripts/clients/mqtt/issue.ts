import { IssueDownMQTT, IssueUpMQTT, Issue } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class IssueClient extends AbstractClient<IssueDownMQTT> implements IssueUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/issues/+/create", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/issues/+/update", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/issues/+/delete", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })

        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('/api/v1/issues')) {
                const issue = JSON.parse(message.toString()).data as Issue
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(issue)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(issue)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(issue)
                    }
                }
            }
        })
    }
}

export const IssueAPI = new IssueClient()