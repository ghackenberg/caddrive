import { CommentDownMQTT, CommentUpMQTT, Comment } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class CommentClient extends AbstractClient<CommentDownMQTT> implements CommentUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/comments/+/create", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/comments/+/update", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/comments/+/delete", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })

        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('/api/v1/comments')) {
                const comment = JSON.parse(message.toString()).data as Comment
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(comment)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(comment)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(comment)
                    }
                }
            }
        })
    }
}

export const CommentAPI = new CommentClient()