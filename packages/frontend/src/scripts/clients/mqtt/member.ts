import { MemberDownMQTT, MemberUpMQTT, Member } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class MemberClient extends AbstractClient<MemberDownMQTT> implements MemberUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/members/+/create", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/members/+/update", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })
        client.subscribe("/api/v1/members/+/delete", error => {
            if (error) {
                console.error('MQTT client subscribe error', error)
            }
        })

        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('/api/v1/members')) {
                const member = JSON.parse(message.toString()).data as Member
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(member)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(member)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(member)
                    }
                }
            }
        })
    }
}

export const MemberAPI = new MemberClient()