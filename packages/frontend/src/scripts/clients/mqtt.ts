import { connect, MqttClient } from 'mqtt'
import { matches } from 'mqtt-pattern'
import shortid from 'shortid'

import { Comment, Issue, Member, Milestone, Product, User, Version } from 'productboard-common'

type handler = (topic: string, data: unknown) => void

const handlers: { [topic: string]: handler[] } = {}

let client: MqttClient

const protocol = location.protocol == 'http:' ? 'ws' : 'wss'
const hostname = location.hostname
const port = parseInt(location.port)

function init() {
    // Connect client
    client = connect({ protocol, hostname, port, path: '/mqtt', clientId: `productboard-frontend-${shortid()}`, username: localStorage.getItem('jwt') })

    // Subscribe after connecting
    client.on('connect', packet => {
        console.log('connect', packet)
        for (const pattern in handlers) {
            client.subscribe(pattern)
        }
    })

    // Forward message to handlers
    client.on('message', (topic, payload, packet) => {
        console.log('message', topic, JSON.parse(payload.toString()), packet)
        const data = JSON.parse(payload.toString())
        for (const pattern in handlers) {
            if (matches(pattern, topic)) {
                for (const handler of handlers[pattern]) {
                    handler(topic, data)
                }
            }
        }
    })

    // Initialize client after disconnection
    client.on('end', () => {
        init()
    })
}
    
function subscribe<T>(topic: string, handler: (topic: string, data: T) => void) {
    // Initialize handlers
    if (!(topic in handlers)) {
        handlers[topic] = []
        if (client.connected) {
            client.subscribe(topic)
        }
    }
    // Add handler
    handlers[topic].push(handler)
    // Return unsubscribe function
    return () => {
        handlers[topic].splice(handlers[topic].indexOf(handler), 1)
        if (handlers[topic].length == 0) {
            delete handlers[topic]
            if (client.connected) {
                client.unsubscribe(topic)
            }
        }
    }
}

init()

export const MqttAPI = {
    user(userId: string, callback: (user: User) => void) {
        const topic = `/users/${userId}`
        return subscribe<User>(topic, (_topic, data) => {
            data.id == userId && callback(data)
        })
    },
    product(productId: string, callback: (product: Product) => void) {
        const topic = `/products/${productId}`
        return subscribe<Product>(topic, (_topic, data) => {
            data.id == productId && callback(data)
        })
    },
    member(productId: string, memberId: string, callback: (member: Member) => void) {
        const topic = `/products/${productId}/members/+`
        return subscribe<Member>(topic, (_topic, data) => {
            data.id == memberId && data.productId == productId && callback(data)
        })
    },
    issue(productId: string, issueId: string, callback: (issue: Issue) => void) {
        const topic = `/products/${productId}/issues/+`
        return subscribe<Issue>(topic, (_topic, data) => {
            data.id == issueId && data.productId == productId && callback(data)
        })
    },
    comment(productId: string, issueId: string, commentId: string, callback: (comment: Comment) => void) {
        const topic = `/products/${productId}/issues/+/comments/+`
        return subscribe<Comment>(topic, (_topic, data) => {
            data.id == commentId && data.issueId == issueId && callback(data)
        })
    },
    milestone(productId: string, milestoneId: string, callback: (milestone: Milestone) => void) {
        const topic = `/products/${productId}/milestones/+`
        return subscribe<Milestone>(topic, (_topic, data) => {
            data.id == milestoneId && data.productId == productId && callback(data)
        })
    },
    version(productId: string, versionId: string, callback: (version: Version) => void) {
        const topic = `/products/${productId}/versions/+`
        return subscribe<Version>(topic, (_topic, data) => {
            data.id == versionId && data.productId == productId && callback(data)
        })
    },
    reconnect() {
        client.end()
    }
}