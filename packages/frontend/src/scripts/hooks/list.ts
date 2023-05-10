import * as React from 'react'

import { CommentManager } from '../managers/comment'
import { IssueManager } from '../managers/issue'
import { MemberManager } from '../managers/member'
import { MilestoneManager } from '../managers/milestone'
import { ProductManager } from '../managers/product'
import { TagManager } from '../managers/tag'
import { TagAssignmentManager } from '../managers/tagAssignment'
import { UserManager } from '../managers/user'
import { VersionManager } from '../managers/version'

function useEntities<T extends { id: string, created: number }>(id: string, cache: () => T[], get: (callback: (values: T[]) => void) => (() => void)) {

    function compare(a: T, b: T) {
        return a.created - b.created
    }

    const initialValue = !id.includes('new') && cache()

    const [values, setValues] = React.useState(initialValue && initialValue.sort(compare))

    React.useEffect(() => {
        if (id !== undefined && id !== null && !id.includes('new')) {
            return get(values => setValues(values.sort(compare)))
        } else {
            setValues(undefined)
            return () => {/**/}
        }
    }, [id])

    return values
}

// USERS

export function useUsers(query?: string, productId?: string) {
    return useEntities(
        '',
        () => UserManager.findUsersFromCache(),
        callback => UserManager.findUsers(query, productId, callback)
    )
}

export function useProducts() {
    return useEntities(
        '',
        () => ProductManager.findProductsFromCache(),
        callback => ProductManager.findProducts(callback)
    )
}

export function useVersions(productId: string) {
    return useEntities(
        productId,
        () => VersionManager.findVersionsFromCache(productId),
        callback => VersionManager.findVersions(productId, callback)
    )
}

export function useIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') {
    return useEntities(
        `${productId}-${milestoneId}-${state}`,
        () => IssueManager.findIssuesFromCache(productId, milestoneId, state),
        callback => IssueManager.findIssues(productId, milestoneId, state, callback)
    )
}

export function useComments(issueId: string) {
    return useEntities(
        issueId,
        () => CommentManager.findCommentsFromCache(issueId),
        callback => CommentManager.findComments(issueId, callback)
    )
}

export function useMilestones(productId: string) {
    return useEntities(
        productId,
        () => MilestoneManager.findMilestonesFromCache(productId),
        callback => MilestoneManager.findMilestones(productId, callback)
    )
}

export function useMembers(productId: string, userId?: string) {
    return useEntities(
        productId,
        () => MemberManager.findMembersFromCache(productId),
        callback => MemberManager.findMembers(productId, userId, callback)
    )
}

export function useTags(productId: string) {
    return useEntities(
        productId,
        () => TagManager.findTagsFromCache(productId),
        callback => TagManager.findTags(productId, callback)
    )
}

export function useTagAssignments(issueId: string) {
    return useEntities(
        issueId ,
        () => TagAssignmentManager.findTagAssignmentsFromCache(issueId),
        callback => TagAssignmentManager.findTagAssignments(issueId, callback)
    )
}