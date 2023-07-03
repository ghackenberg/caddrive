import * as React from 'react'

import { COMMENT_CACHE, ISSUE_CACHE, MEMBER_CACHE, MILESTONE_CACHE, PRODUCT_CACHE, USER_CACHE, VERSION_CACHE } from '../clients/cache'
import { MqttAPI } from '../clients/mqtt'

export function useUser(userId: string) {
    const initialValue = USER_CACHE[userId]

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return userId != 'new' && MqttAPI.subscribeUser(userId, user => {
            if (!value || value.updated < user.updated) {
                setValue(user)
            }
        })
    }, [userId])

    return value
}

export function useProduct(productId: string) {
    const initialValue = PRODUCT_CACHE[productId]

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return productId != 'new' && MqttAPI.subscribeProduct(productId, product => {
            if (!value || value.updated < product.updated) {
                setValue(product)
            }
        })
    }, [productId])

    return value
}

export function useVersion(productId: string, versionId: string) {
    const initialValue = VERSION_CACHE[versionId]

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return versionId != 'new' && MqttAPI.subscribeVersion(productId, versionId, version => {
            if (!value || value.updated < version.updated) {
                setValue(value)
            }
        })
    }, [productId, versionId])

    return value
}

export function useIssue(productId: string, issueId: string) {
    const initialValue = ISSUE_CACHE[issueId]

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return issueId != 'new' && MqttAPI.subscribeIssue(productId, issueId, issue => {
            if (!value || value.updated < issue.updated) {
                setValue(issue)
            }
        })
    }, [productId, issueId])

    return value
}

export function useComment(productId: string, issueId: string, commentId: string) {
    const initialValue = COMMENT_CACHE[commentId]

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return commentId != 'new' && MqttAPI.subscribeComment(productId, issueId, commentId, comment => {
            if (!value || value.updated < comment.updated) {
                setValue(comment)
            }
        })
    }, [productId, issueId, commentId])

    return value
}

export function useMilestone(productId: string, milestoneId: string) {
    const initialValue = MILESTONE_CACHE[milestoneId]

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return milestoneId != 'new' && MqttAPI.subscribeMilestone(productId, milestoneId, milestone => {
            if (!value || value.updated < milestone.updated) {
                setValue(milestone)
            }
        })
    }, [productId, milestoneId])

    return value
}

export function useMember(productId: string, memberId: string) {
    const initialValue = MEMBER_CACHE[memberId]

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return memberId != 'new' && MqttAPI.subscribeMember(productId, memberId, member => {
            if (!value || value.updated < member.updated) {
                setValue(member)
            }
        })
    }, [productId, memberId])

    return value
}