import * as React from 'react'

import { CacheAPI } from '../clients/cache'
import { ProductClient } from '../clients/rest/product'
import { UserClient } from '../clients/rest/user'

type Entity = { created: number }
type Predicate<T> = (value: T) => boolean
type Compare<T> = (a: T, b: T) => number
type Unsubscribe = () => void
type Callback<T> = (value: T) => void
type Subscribe<T> = (callback: Callback<T>) => Unsubscribe

// Helper

function valid(ids: string[]) {
    return ids.map(id => id && id != 'new').reduce((a, b) => a && b, true)
}

// REST entities

function useRestEntites<T extends Entity>(ids: string[], load: () => Promise<T[]>, predicate: Predicate<T> = (() => true), compare: Compare<T> = ((a, b) => a.created - b.created)) {
    const [value, setValue] = React.useState<T[]>()

    React.useEffect(() => {
        if (valid(ids)) {
            let execute = true
            load().then(entities => execute && setValue(entities.filter(predicate).sort(compare)))
            return () => {
                execute = false
            }
        } else {
            return setValue(undefined)
        }
    }, ids)

    return value
}

// MQTT entities

function useMqttEntities<T extends Entity>(ids: string[], initialValue: T[], subscribe: Subscribe<T[]>, predicate: Predicate<T> = (() => true), compare: Compare<T> = ((a, b) => a.created - b.created)) {
    const [value, setValue] = React.useState(initialValue && initialValue.filter(predicate).sort(compare))

    React.useEffect(() => {
        if (valid(ids)) {
            return subscribe(entities => setValue(entities.filter(predicate).sort(compare)))
        } else {
            return setValue(undefined)
        }
    }, ids)

    return value
}

// Users

export function useUsers() {
    return useRestEntites([""], () => UserClient.findUsers())
}

// Products

export function useProducts(_public: "true" | "false") {
    return useRestEntites([_public], () => ProductClient.findProducts(_public))
}

// Verions

export function useVersions(productId: string) {
    return useMqttEntities(
        [productId],
        CacheAPI.getVersions(productId),
        callback => CacheAPI.subscribeVersions(productId, callback)
    )
}

// Issues

export function useIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') {
    return useMqttEntities(
        [productId],
        CacheAPI.getIssues(productId),
        callback => CacheAPI.subscribeIssues(productId, callback),
        issue => (!milestoneId || issue.milestoneId == milestoneId) && (!state || issue.state == state)
    )
}

// Comments

export function useComments(productId: string, issueId: string) {
    return useMqttEntities(
        [productId, issueId],
        CacheAPI.getComments(productId, issueId),
        callback => CacheAPI.subscribeComments(productId, issueId, callback)
    )
}

// Milestones

export function useMilestones(productId: string) {
    return useMqttEntities(
        [productId],
        CacheAPI.getMilestones(productId),
        callback => CacheAPI.subscribeMilestones(productId, callback)
    )
}

// Members

export function useMembers(productId: string, userId?: string) {
    return useMqttEntities(
        [productId],
        CacheAPI.getMembers(productId),
        callback => CacheAPI.subscribeMembers(productId, callback),
        member => !userId || member.userId == userId
    )
}