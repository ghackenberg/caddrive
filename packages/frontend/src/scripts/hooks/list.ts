import * as React from 'react'

import { CommentManager } from '../managers/comment'
import { IssueManager } from '../managers/issue'
import { MemberManager } from '../managers/member'
import { MilestoneManager } from '../managers/milestone'
import { ProductManager } from '../managers/product'
import { UserManager } from '../managers/user'
import { VersionManager } from '../managers/version'

function useEntities<T extends { id: string, created: number }>(id: string, cache: () => T[], get: () => Promise<T[]>) {

    function compare(a: T, b: T) {
        return a.created - b.created
    }

    const initialValue = !id.includes('new') && cache()

    const [values, setValues] = React.useState(initialValue && initialValue.sort(compare))

    React.useEffect(() => {
        let exec = true
        !values && !id.includes('new') && get().then(values => exec && setValues(values.sort(compare)))
        return () => { exec = false }
    }, [id])

    return values
}

// USERS

export function useUsers() {
    return useEntities(
        '',
        () => UserManager.findUsersFromCache(),
        () => UserManager.findUsers()
    )
}

export function useProducts() {
    return useEntities(
        '',
        () => ProductManager.findProductsFromCache(),
        () => ProductManager.findProducts()
    )
}

export function useVersions(productId: string) {
    return useEntities(
        productId,
        () => VersionManager.findVersionsFromCache(productId),
        () => VersionManager.findVersions(productId)
    )
}

export function useIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') {
    return useEntities(
        `${productId}-${milestoneId}-${state}`,
        () => IssueManager.findIssuesFromCache(productId, milestoneId, state),
        () => IssueManager.findIssues(productId, milestoneId, state)
    )
}

export function useComments(issueId: string) {
    return useEntities(
        issueId,
        () => CommentManager.findCommentsFromCache(issueId),
        () => CommentManager.findComments(issueId)
    )
}

export function useMilestones(productId: string) {
    return useEntities(
        productId,
        () => MilestoneManager.findMilestonesFromCache(productId),
        () => MilestoneManager.findMilestones(productId)
    )
}

export function useMembers(productId: string) {
    return useEntities(
        productId,
        () => MemberManager.findMembersFromCache(productId),
        () => MemberManager.findMembers(productId)
    )
}