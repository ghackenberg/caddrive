import { TagAssignmentDownMQTT, TagAssignmentUpMQTT, TagAssignment } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class TagAssignmentClient extends AbstractClient<TagAssignmentDownMQTT> implements TagAssignmentUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/tagAssignments/+/create", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/tagAssignments/+/update", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/tagAssignments/+/delete", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })

        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('/api/v1/tagAssignments')) {
                const tagAssignment = JSON.parse(message.toString()).data as TagAssignment
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(tagAssignment)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(tagAssignment)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(tagAssignment)
                    }
                }
            }
        })
    }
}

export const TagAssignmentAPI = new TagAssignmentClient()