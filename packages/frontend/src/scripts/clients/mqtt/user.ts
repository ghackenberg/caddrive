import { User, UserDownMQTT, UserUpMQTT } from "productboard-common"

import { client } from "../mqtt"
import { AbstractClient } from "./abstract"

class UserClient extends AbstractClient<UserDownMQTT> implements UserUpMQTT {
    constructor() {
        super()
        // Subscribe
        client.subscribe("/api/v1/users/#/create")
        client.subscribe("/api/v1/users/#/update")
        client.subscribe("/api/v1/users/#/delete")
        // Handle
        client.on('message', (topic, message) => {
            if (topic.startsWith('api/v1/users')) {
                const user = JSON.parse(message.toString()) as User
                if (topic.endsWith('create')) {
                    for (const handler of this.handlers) {
                        handler.create(user)
                    }
                } else if (topic.endsWith('update')) {
                    for (const handler of this.handlers) {
                        handler.update(user)
                    }
                } else if (topic.endsWith('delete')) {
                    for (const handler of this.handlers) {
                        handler.delete(user)
                    }
                }
            }
        })
    }
}

export const UserAPI = new UserClient()