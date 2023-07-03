import * as React from 'react'

import { Issue, Member, Product, User } from "productboard-common"

import { CacheAPI } from '../clients/cache'
import { MqttAPI } from '../clients/mqtt'
import { ProductClient } from '../clients/rest/product'
import { UserClient } from '../clients/rest/user'

// Users

export function useUsers() {
    const initialValue: User[] = undefined

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        value || UserClient.findUsers().then(users => exec && setValue(users))
        return () => { exec = false }
    })

    return value
}

// Products

export function useProducts(_public: "true" | "false") {
    const initialValue: Product[] = undefined

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        value || ProductClient.findProducts(_public).then(products => exec && setValue(products))
        return () => { exec = false }
    })

    return value
}

// Verions

export function useVersions(productId: string) {
    const initialValue = CacheAPI.getVersions(productId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        productId != 'new' && CacheAPI.loadVersions(productId).then(versions => exec && setValue(versions))
        return () => { exec = false }
    }, [productId])

    React.useEffect(() => {
        return productId != 'new' && MqttAPI.subscribeVersions(productId, versions => {
            setValue(versions)
        })
    }, [productId])

    return value
}

// Issues

export function useIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') {
    function predicate(issue: Issue) {
        return (!milestoneId || issue.milestoneId == milestoneId) && (!state || issue.state == state)
    }

    const initialIssues = CacheAPI.getIssues(productId)

    const initialValue = initialIssues && initialIssues.filter(predicate)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        productId != 'new' && CacheAPI.loadIssues(productId).then(issues => exec && setValue(issues.filter(predicate)))
        return () => { exec = false }
    }, [productId, milestoneId, state])

    React.useEffect(() => {
        return productId != 'new' && MqttAPI.subscribeIssues(productId, issues => {
            setValue(issues.filter(predicate))
        })
    }, [productId, milestoneId, state])

    return value
}

// Comments

export function useComments(productId: string, issueId: string) {
    const initialValue = CacheAPI.getComments(productId, issueId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        productId != 'new' && issueId != 'new' && CacheAPI.loadComments(productId, issueId).then(comments => exec && setValue(comments))
        return () => { exec = false }
    }, [productId, issueId])

    React.useEffect(() => {
        return productId != 'new' && issueId != 'new' && MqttAPI.subscribeComments(productId, issueId, comments => {
            setValue(comments)
        })
    }, [productId, issueId])

    return value
}

// Milestones

export function useMilestones(productId: string) {
    const initialValue = CacheAPI.getMilestones(productId)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        productId != 'new' && CacheAPI.loadMilestones(productId).then(milestones => exec && setValue(milestones))
        return () => { exec = false }
    }, [productId])

    React.useEffect(() => {
        return productId != 'new' && MqttAPI.subscribeMilestones(productId, milestones => {
            setValue(milestones)
        })
    }, [productId])

    return value
}

// Members

export function useMembers(productId: string, userId?: string) {
    function predicate(member: Member) {
        return !userId || member.userId == userId
    }

    const initialMembers = CacheAPI.getMembers(productId)

    const initialValue = initialMembers && initialMembers.filter(predicate)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        productId != 'new' && CacheAPI.loadMembers(productId).then(members => exec && setValue(members.filter(predicate)))
        return () => { exec = false }
    }, [productId, userId])

    React.useEffect(() => {
        return productId != 'new' && MqttAPI.subscribeMembers(productId, members => {
            setValue(members.filter(predicate))
        })
    }, [productId, userId])

    return value
}