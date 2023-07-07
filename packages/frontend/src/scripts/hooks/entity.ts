import * as React from 'react'

import { CacheAPI } from '../clients/cache'
import { UserContext } from '../contexts/User'

type Entity = { updated: number }
type Update<T> = (value: T) => void
type Unsubscribe = () => void
type Subscribe<T> = (update: Update<T>) => Unsubscribe

// Helper

function valid(ids: string[]) {
    return ids.map(id => id && id != 'new').reduce((a, b) => a && b, true)
}

// Entity

export function useEntity<T extends Entity>(ids: string[], initialValue: T, subscribe: Subscribe<T>) {
    const { contextUser } = React.useContext(UserContext)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        if (valid(ids)) {
            return subscribe(setValue)
        } else {
            return setValue(undefined)
        }
    }, [contextUser, ...ids])

    return value
}

// User

export function useUser(userId: string) {
    return useEntity(
        [userId],
        CacheAPI.getUser(userId),
        callback => CacheAPI.subscribeUser(userId, callback)
    )
}

// Product

export function useProduct(productId: string) {
    return useEntity(
        [productId],
        CacheAPI.getProduct(productId),
        callback => CacheAPI.subscribeProduct(productId, callback)
    )
}

// Version

export function useVersion(productId: string, versionId: string) {
    return useEntity(
        [productId, versionId],
        CacheAPI.getVersion(productId, versionId),
        callback => CacheAPI.subscribeVersion(productId, versionId, callback)
    )
}

// Issue

export function useIssue(productId: string, issueId: string) {
    return useEntity(
        [productId, issueId],
        CacheAPI.getIssue(productId, issueId),
        callback => CacheAPI.subscribeIssue(productId, issueId, callback)
    )
}

// Comment

export function useComment(productId: string, issueId: string, commentId: string) {
    return useEntity(
        [productId, issueId, commentId],
        CacheAPI.getComment(productId, issueId, commentId),
        callback => CacheAPI.subscribeComment(productId, issueId, commentId, callback)
    )
}

// Milestone

export function useMilestone(productId: string, milestoneId: string) {
    return useEntity(
        [productId, milestoneId],
        CacheAPI.getMilestone(productId, milestoneId),
        callback => CacheAPI.subscribeMilestone(productId, milestoneId, callback)
    )
}

// Member

export function useMember(productId: string, memberId: string) {
    return useEntity(
        [productId, memberId],
        CacheAPI.getMember(productId, memberId),
        callback => CacheAPI.subscribeMember(productId, memberId, callback)
    )
}