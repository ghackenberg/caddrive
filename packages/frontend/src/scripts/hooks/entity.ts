import * as React from 'react'

import { Comment, Issue, Member, Milestone, Product, User, Version } from 'productboard-common'

import { MqttAPI } from '../clients/mqtt'
import { CommentManager } from '../managers/comment'
import { IssueManager } from '../managers/issue'
import { MemberManager } from '../managers/member'
import { MilestoneManager } from '../managers/milestone'
import { ProductManager } from '../managers/product'
import { UserManager } from '../managers/user'
import { VersionManager } from '../managers/version'

export function useUser(userId: string) {
    const initialValue = userId != 'new' && UserManager.getUserFromCache(userId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return userId != 'new' && MqttAPI.subscribe(`/users/${userId}`, (_topic, payload) => {
            const user = JSON.parse(payload.toString()) as User
            if (!value || value.updated < user.updated) {
                setValue(user)
            }
        })
    }, [userId])

    return value
}

export function useProduct(productId: string) {
    const initialValue = productId != 'new' && ProductManager.getProductFromCache(productId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return productId != 'new' && MqttAPI.subscribe(`/products/${productId}`, (_topic, payload) => {
            const product = JSON.parse(payload.toString()) as Product
            if (!value || value.updated < product.updated) {
                setValue(product)
            }
        })
    }, [productId])

    return value
}

export function useVersion(productId: string, versionId: string) {
    const initialValue = versionId != 'new' && VersionManager.getVersionFromCache(versionId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return versionId != 'new' && MqttAPI.subscribe(`/products/${productId}/versions/${versionId}`, (_topic, payload) => {
            const version = JSON.parse(payload.toString()) as Version
            if (!version || value.updated < version.updated) {
                setValue(value)
            }
        })
    }, [productId, versionId])

    return value
}

export function useIssue(productId: string, issueId: string) {
    const initialValue = issueId != 'new' && IssueManager.getIssueFromCache(issueId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return issueId != 'new' && MqttAPI.subscribe(`/products/${productId}/issues/${issueId}`, (_topic, payload) => {
            const issue = JSON.parse(payload.toString()) as Issue
            if (!value || value.updated < issue.updated) {
                setValue(issue)
            }
        })
    }, [productId, issueId])

    return value
}

export function useComment(productId: string, issueId: string, commentId: string) {
    const initialValue = commentId != 'new' && CommentManager.getCommentFromCache(commentId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return commentId != 'new' && MqttAPI.subscribe(`/products/${productId}/issues/${issueId}/comments/${commentId}`, (_topic, payload) => {
            const comment = JSON.parse(payload.toString()) as Comment
            if (!value || value.updated < comment.updated) {
                setValue(comment)
            }
        })
    }, [productId, issueId, commentId])

    return value
}

export function useMilestone(productId: string, milestoneId: string) {
    const initialValue = milestoneId != 'new' && MilestoneManager.getMilestoneFromCache(milestoneId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return milestoneId != 'new' && MqttAPI.subscribe(`/products/${productId}/milestones/${milestoneId}`, (_topic, payload) => {
            const milestone = JSON.parse(payload.toString()) as Milestone
            if (!value || value.updated < milestone.updated) {
                setValue(milestone)
            }
        })
    }, [productId, milestoneId])

    return value
}

export function useMember(productId: string, memberId: string) {
    const initialValue = memberId != 'new' && MemberManager.getMemberFromCache(memberId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        return memberId != 'new' && MqttAPI.subscribe(``, (_topic, payload) => {
            const member = JSON.parse(payload.toString()) as Member
            if (!value || value.updated < member.updated) {
                setValue(member)
            }
        })
    }, [productId, memberId])

    return value
}