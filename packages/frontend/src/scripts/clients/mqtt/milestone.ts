import { MilestoneDownMQTT, MilestoneUpMQTT, Milestone } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class MilestoneClient extends AbstractClient<MilestoneDownMQTT> implements MilestoneUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/milestones/+/create", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/milestones/+/update", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/milestones/+/delete", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })

        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('/api/v1/milestones')) {
                const milestone = JSON.parse(message.toString()).data as Milestone
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(milestone)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(milestone)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(milestone)
                    }
                }
            }
        })
    }
}

export const MilestoneAPI = new MilestoneClient()