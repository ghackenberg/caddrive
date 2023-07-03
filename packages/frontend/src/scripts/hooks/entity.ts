import * as React from 'react'

import { CacheAPI } from '../clients/cache'
import { MqttAPI } from '../clients/mqtt'

function valid(...ids: string[]) {
    return ids.map(id => id && id != 'new').reduce((a, b) => a && b, true)
}

// User

export function useUser(userId: string) {
    const initialValue = CacheAPI.getUser(userId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        valid(userId) && CacheAPI.loadUser(userId).then(user => exec && setValue(user))
        return () => { exec = false }
    }, [userId])

    React.useEffect(() => {
        return valid(userId) && MqttAPI.subscribeUser(userId, user => {
            if (!value || value.updated < user.updated) {
                setValue(user)
            }
        })
    }, [userId])

    return value
}

// Product

export function useProduct(productId: string) {
    const initialValue = CacheAPI.getProduct(productId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        valid(productId) && CacheAPI.loadProduct(productId).then(product => exec && setValue(product))
        return () => { exec = false }
    }, [productId])

    React.useEffect(() => {
        return valid(productId) && MqttAPI.subscribeProduct(productId, product => {
            if (!value || value.updated < product.updated) {
                setValue(product)
            }
        })
    }, [productId])

    return value
}

// Version

export function useVersion(productId: string, versionId: string) {
    const initialValue = CacheAPI.getVersion(productId, versionId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        valid(productId, versionId) && CacheAPI.loadVersion(productId, versionId).then(version => exec && setValue(version))
        return () => { exec = false }
    }, [productId, versionId])

    React.useEffect(() => {
        return valid(productId, versionId) && MqttAPI.subscribeVersion(productId, versionId, version => {
            if (!value || value.updated < version.updated) {
                setValue(value)
            }
        })
    }, [productId, versionId])

    return value
}

// Issue

export function useIssue(productId: string, issueId: string) {
    const initialValue = CacheAPI.getIssue(productId, issueId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        valid(productId, issueId) && CacheAPI.loadIssue(productId, issueId).then(issue => exec && setValue(issue))
        return () => { exec = false }
    }, [productId, issueId])

    React.useEffect(() => {
        return valid(productId, issueId) && MqttAPI.subscribeIssue(productId, issueId, issue => {
            if (!value || value.updated < issue.updated) {
                setValue(issue)
            }
        })
    }, [productId, issueId])

    return value
}

// Comment

export function useComment(productId: string, issueId: string, commentId: string) {
    const initialValue = CacheAPI.getComment(productId, issueId, commentId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        valid(productId, issueId, commentId) && CacheAPI.loadComment(productId, issueId, commentId).then(comment => exec && setValue(comment))
        return () => { exec = false }
    }, [productId, issueId, commentId])

    React.useEffect(() => {
        return valid(productId, issueId, commentId) && MqttAPI.subscribeComment(productId, issueId, commentId, comment => {
            if (!value || value.updated < comment.updated) {
                setValue(comment)
            }
        })
    }, [productId, issueId, commentId])

    return value
}

// Milestone

export function useMilestone(productId: string, milestoneId: string) {
    const initialValue = CacheAPI.getMilestone(productId, milestoneId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        valid(productId, milestoneId) && CacheAPI.loadMilestone(productId, milestoneId).then(milestone => exec && setValue(milestone))
        return () => { exec = false }
    }, [productId, milestoneId])

    React.useEffect(() => {
        return valid(productId, milestoneId) && MqttAPI.subscribeMilestone(productId, milestoneId, milestone => {
            if (!value || value.updated < milestone.updated) {
                setValue(milestone)
            }
        })
    }, [productId, milestoneId])

    return value
}

// Member

export function useMember(productId: string, memberId: string) {
    const initialValue = CacheAPI.getMember(productId, memberId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        valid(productId, memberId) && CacheAPI.loadMember(productId, memberId).then(member => exec && setValue(member))
        return () => { exec = false }
    }, [productId, memberId])

    React.useEffect(() => {
        return valid(productId, memberId) && MqttAPI.subscribeMember(productId, memberId, member => {
            if (!value || value.updated < member.updated) {
                setValue(member)
            }
        })
    }, [productId, memberId])

    return value
}