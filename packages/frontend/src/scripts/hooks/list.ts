import * as React from 'react'

import { AbstractClient } from '../clients/mqtt/abstract'
import { CommentAPI } from '../clients/mqtt/comment'
import { IssueAPI } from '../clients/mqtt/issue'
import { MemberAPI } from '../clients/mqtt/member'
import { MilestoneAPI } from '../clients/mqtt/milestone'
import { ProductAPI } from '../clients/mqtt/product'
import { UserAPI } from '../clients/mqtt/user'
import { VersionAPI } from '../clients/mqtt/version'
import { CommentManager } from '../managers/comment'
import { IssueManager } from '../managers/issue'
import { MemberManager } from '../managers/member'
import { MilestoneManager } from '../managers/milestone'
import { ProductManager } from '../managers/product'
import { UserManager } from '../managers/user'
import { VersionManager } from '../managers/version'

function useEntities<T extends { id: string, created: number }>(cache: () => T[], get: () => Promise<T[]>, API: AbstractClient<{ create: (e: T) => void, update: (e: T) => void, delete: (e: T) => void }>, include: (e: T) => boolean = () => true) {

    function compare(a: T, b: T) {
        return a.created - b.created
    }

    const initialValue = cache()

    const [values, setValues] = React.useState(initialValue && initialValue.sort(compare))

    React.useEffect(() => {
        let exec = true
        !values && get().then(values => exec && setValues(values.sort(compare)))
        return () => { exec = false }
    })

    React.useEffect(() => {
        return API.register({
            create(e) {
                if (values) {
                    if (include(e)) {
                        setValues([...values.filter(other => other.id != e.id), e].sort(compare))
                    } else {
                        setValues(values.filter(other => other.id != e.id).sort(compare))
                    }
                }
            },
            update(e) {
                if (values) {
                    if (include(e)) {
                        setValues([...values.filter(other => other.id != e.id), e].sort(compare))
                    } else {
                        setValues(values.filter(other => other.id != e.id).sort(compare))
                    }
                }
            },
            delete(e) {
                if (values) {
                    setValues(values.filter(other => other.id != e.id).sort(compare))
                }
            }
        })
    })

    return values
}

// USERS

export function useUsers() {
    return useEntities(
        () => UserManager.findUsersFromCache(),
        () => UserManager.findUsers(),
        UserAPI
    )
}

export function useProducts() {
    return useEntities(
        () => ProductManager.findProductsFromCache(),
        () => ProductManager.findProducts(),
        ProductAPI
    )
}

export function useVersions(productId: string) {
    return useEntities(
        () => productId != 'new' && VersionManager.findVersionsFromCache(productId),
        () => productId != 'new' && VersionManager.findVersions(productId),
        VersionAPI,
        version => version.productId == productId
    )
}

export function useIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') {
    return useEntities(
        () => productId != 'new' && milestoneId != 'new' && IssueManager.findIssuesFromCache(productId, milestoneId, state),
        () => productId != 'new' && milestoneId != 'new' && IssueManager.findIssues(productId, milestoneId, state),
        IssueAPI,
        issue => issue.productId == productId && (!milestoneId || issue.milestoneId == milestoneId) && (!state || issue.state == state)
    )
}

export function useComments(issueId: string) {
    return useEntities(
        () => issueId != 'new' && CommentManager.findCommentsFromCache(issueId),
        () => issueId != 'new' && CommentManager.findComments(issueId),
        CommentAPI,
        comment => comment.issueId == issueId
    )
}

export function useMilestones(productId: string) {
    return useEntities(
        () => productId != 'new' && MilestoneManager.findMilestonesFromCache(productId),
        () => productId != 'new' && MilestoneManager.findMilestones(productId),
        MilestoneAPI,
        milestone => milestone.productId == productId
    )
}

export function useMembers(productId: string) {
    return useEntities(
        () => productId != 'new' && MemberManager.findMembersFromCache(productId),
        () => productId != 'new' && MemberManager.findMembers(productId),
        MemberAPI,
        member => member.productId == productId
    )
}