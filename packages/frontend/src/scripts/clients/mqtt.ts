import { connect, MqttClient } from 'mqtt'
import { matches } from 'mqtt-pattern'
import shortid from 'shortid'

import { Comment, Issue, Member, Milestone, Product, User, Version } from 'productboard-common'

type handler = (topic: string, object: unknown) => void

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
        const object = JSON.parse(payload.toString())
        publishLocal(topic, object)
    })

    // Initialize client after disconnection
    client.on('end', () => {
        init()
    })
}
    
function subscribe<T>(topic: string, handler: (topic: string, object: T) => void) {
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

function publishLocal<T>(topic: string, object: T) {
    for (const pattern in handlers) {
        if (matches(pattern, topic)) {
            for (const handler of handlers[pattern]) {
                handler(topic, object)
            }
        }
    }
}

init()

export const MqttAPI = {
    publishUserLocal(userId: string, user: User) {
        const topic = `/users/${userId}`
        publishLocal(topic, user)
    },
    publishProductLocal(productId: string, product: Product) {
        const topic = `/products/${productId}`
        publishLocal(topic, product)
    },
    publishMemberLocal(productId: string, memberId: string, member: Member) {
        const topic = `/products/${productId}/members/${memberId}`
        publishLocal(topic, member)
    },
    publishIssueLocal(productId: string, issueId: string, issue: Issue) {
        const topic = `/products/${productId}/issues/${issueId}`
        publishLocal(topic, issue)
    },
    publishCommentLocal(productId: string, issueId: string, commentId: string, comment: Comment) {
        const topic = `/products/${productId}/issues/${issueId}/comments/${commentId}`
        publishLocal(topic, comment)
    },
    publishMilestoneLocal(productId: string, milestoneId: string, milestone: Milestone) {
        const topic = `/products/${productId}/milestones/${milestoneId}`
        publishLocal(topic, milestone)
    },
    publishVersionLocal(productId: string, versionId: string, version: Version) {
        const topic = `/products/${productId}/versions/${versionId}`
        publishLocal(topic, version)
    },
    subscribeUser(userId: string, callback: (user: User) => void) {
        const topic = `/users/${userId}`
        return subscribe<User>(topic, (_topic, user) => {
            user.id == userId && callback(user)
        })
    },
    subscribeProduct(productId: string, callback: (product: Product) => void) {
        const topic = `/products/${productId}`
        return subscribe<Product>(topic, (_topic, product) => {
            product.id == productId && callback(product)
        })
    },
    subscribeMembers(productId: string, _callback: (members: Member[]) => void) {
        const topic = `/products/${productId}/members/+`
        return subscribe<Member>(topic, (_topic, _data) => {
            // TODO
        })
    },
    subscribeMember(productId: string, memberId: string, callback: (member: Member) => void) {
        const topic = `/products/${productId}/members/+`
        return subscribe<Member>(topic, (_topic, member) => {
            member.id == memberId && member.productId == productId && callback(member)
        })
    },
    subscribeIssue(productId: string, issueId: string, callback: (issue: Issue) => void) {
        const topic = `/products/${productId}/issues/+`
        return subscribe<Issue>(topic, (_topic, issue) => {
            issue.id == issueId && issue.productId == productId && callback(issue)
        })
    },
    subscribeComment(productId: string, issueId: string, commentId: string, callback: (comment: Comment) => void) {
        const topic = `/products/${productId}/issues/+/comments/+`
        return subscribe<Comment>(topic, (_topic, comment) => {
            comment.id == commentId && comment.issueId == issueId && callback(comment)
        })
    },
    subscribeMilestone(productId: string, milestoneId: string, callback: (milestone: Milestone) => void) {
        const topic = `/products/${productId}/milestones/+`
        return subscribe<Milestone>(topic, (_topic, milestone) => {
            milestone.id == milestoneId && milestone.productId == productId && callback(milestone)
        })
    },
    subscribeVersion(productId: string, versionId: string, callback: (version: Version) => void) {
        const topic = `/products/${productId}/versions/+`
        return subscribe<Version>(topic, (_topic, version) => {
            version.id == versionId && version.productId == productId && callback(version)
        })
    },
    reconnect() {
        client.end()
    }
}