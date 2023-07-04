import { connect, MqttClient } from 'mqtt'
import { matches } from 'mqtt-pattern'
import shortid from 'shortid'

import { Comment, Issue, Member, Milestone, Product, User, Version } from 'productboard-common'

import { CacheAPI } from './cache'

type handler = (topic: string, object: unknown) => void

const handlers: { [topic: string]: handler[] } = {}

let client: MqttClient

const protocol = location.protocol == 'http:' ? 'ws' : 'wss'
const hostname = location.hostname
const port = parseInt(location.port)
const path = '/mqtt'
const clientId = `productboard-frontend-${shortid()}`

function init() {
    const username = localStorage.getItem('jwt')
    
    // Connect client
    client = connect({ protocol, hostname, port, path, clientId, username })

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
        for (const pattern in handlers) {
            delete handlers[pattern]
        }
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
    // Update cache

    if (matches('/users/+', topic)) {
        CacheAPI.putUser(object as User)
    } else if (matches('/products/+', topic)) {
        CacheAPI.putProduct(object as Product)
    } else if (matches('/products/+/members/+', topic)) {
        CacheAPI.putMember(object as Member)
    } else if (matches('/products/+/issues/+', topic)) {
        CacheAPI.putIssue(object as Issue)
    } else if (matches('/products/+/issues/+/comments/+', topic)) {
        CacheAPI.putComment(object as Comment)
    } else if (matches('/products/+/milestones/+', topic)) {
        CacheAPI.putMilestone(object as Milestone)
    } else if (matches('/products/+/versions/+', topic)) {
        CacheAPI.putVersion(object as Version)
    } else {
        console.warn('MQTT topic not supported', topic, object)
    }

    // Call handlers

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

    // Publish

    publishUserLocal(user: User) {
        const topic = `/users/${user.userId}`
        publishLocal(topic, user)
    },
    publishProductLocal(product: Product) {
        const topic = `/products/${product.productId}`
        publishLocal(topic, product)
    },
    publishMemberLocal(member: Member) {
        const topic = `/products/${member.productId}/members/${member.memberId}`
        publishLocal(topic, member)
    },
    publishIssueLocal(issue: Issue) {
        const topic = `/products/${issue.productId}/issues/${issue.issueId}`
        publishLocal(topic, issue)
    },
    publishCommentLocal(comment: Comment) {
        const topic = `/products/${comment.productId}/issues/${comment.issueId}/comments/${comment.commentId}`
        publishLocal(topic, comment)
    },
    publishMilestoneLocal(milestone: Milestone) {
        const topic = `/products/${milestone.productId}/milestones/${milestone.milestoneId}`
        publishLocal(topic, milestone)
    },
    publishVersionLocal(version: Version) {
        const topic = `/products/${version.productId}/versions/${version.versionId}`
        publishLocal(topic, version)
    },

    // Subscribe entity

    subscribeUser(userId: string, callback: (user: User) => void) {
        const topic = `/users/${userId}`
        return subscribe<User>(topic, (_topic, user) => {
            user.userId == userId && callback(user)
        })
    },
    subscribeProduct(productId: string, callback: (product: Product) => void) {
        const topic = `/products/${productId}`
        return subscribe<Product>(topic, (_topic, product) => {
            product.productId == productId && callback(product)
        })
    },
    subscribeMember(productId: string, memberId: string, callback: (member: Member) => void) {
        const topic = `/products/${productId}/members/+`
        return subscribe<Member>(topic, (_topic, member) => {
            member.memberId == memberId && member.productId == productId && callback(member)
        })
    },
    subscribeIssue(productId: string, issueId: string, callback: (issue: Issue) => void) {
        const topic = `/products/${productId}/issues/+`
        return subscribe<Issue>(topic, (_topic, issue) => {
            issue.issueId == issueId && issue.productId == productId && callback(issue)
        })
    },
    subscribeComment(productId: string, issueId: string, commentId: string, callback: (comment: Comment) => void) {
        const topic = `/products/${productId}/issues/+/comments/+`
        return subscribe<Comment>(topic, (_topic, comment) => {
            comment.commentId == commentId && comment.issueId == issueId && comment.productId == productId && callback(comment)
        })
    },
    subscribeMilestone(productId: string, milestoneId: string, callback: (milestone: Milestone) => void) {
        const topic = `/products/${productId}/milestones/+`
        return subscribe<Milestone>(topic, (_topic, milestone) => {
            milestone.milestoneId == milestoneId && milestone.productId == productId && callback(milestone)
        })
    },
    subscribeVersion(productId: string, versionId: string, callback: (version: Version) => void) {
        const topic = `/products/${productId}/versions/+`
        return subscribe<Version>(topic, (_topic, version) => {
            version.versionId == versionId && version.productId == productId && callback(version)
        })
    },

    // Subscribe list

    subscribeMembers(productId: string, callback: (members: Member[]) => void) {
        const topic = `/products/${productId}/members/+`
        return subscribe<Member>(topic, (_topic, member) => {
            member.productId == productId && callback(CacheAPI.getMembers(productId))
        })
    },
    subscribeIssues(productId: string, callback: (issues: Issue[]) => void) {
        const topic = `/products/${productId}/issues/+`
        return subscribe<Issue>(topic, (_topic, issue) => {
            issue.productId == productId && callback(CacheAPI.getIssues(productId))
        })
    },
    subscribeComments(productId: string, issueId: string, callback: (comments: Comment[]) => void) {
        const topic = `/products/${productId}/issues/+/comments/+`
        return subscribe<Comment>(topic, (_topic, comment) => {
            comment.productId == productId && comment.issueId == issueId && callback(CacheAPI.getComments(productId, issueId))
        })
    },
    subscribeMilestones(productId: string, callback: (milestones: Milestone[]) => void) {
        const topic = `/products/${productId}/milestones/+`
        return subscribe<Milestone>(topic, (_topic, milestone) => {
            milestone.productId == productId && callback(CacheAPI.getMilestones(productId))
        })
    },
    subscribeVersions(productId: string, callback: (versions: Version[]) => void) {
        const topic = `/products/${productId}/versions/+`
        return subscribe<Version>(topic, (_topic, version) => {
            version.productId == productId && callback(CacheAPI.getVersions(productId))
        })
    },

    // Other

    reconnect() {
        client.end()
    }

}