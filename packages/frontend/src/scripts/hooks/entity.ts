import * as React from 'react'

import { IssueManager } from '../managers/issue'
import { MemberManager } from '../managers/member'
import { MilestoneManager } from '../managers/milestone'
import { ProductManager } from '../managers/product'
import { UserManager } from '../managers/user'
import { VersionManager } from '../managers/version'

function useEntity<T extends { id: string }>(id: string, cache: () => T, get: () => Promise<T>) {
    const initialValue = id && id != 'new' && cache()

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        if (id && id != 'new') {
            get().then(value => exec && setValue(value)).catch(() => exec && setValue(undefined))
        } else {
            setValue(undefined)
        }
        return () => { exec = false }
    }, [id])

    React.useEffect(() => {
        let exec = true
        function update() {
            if (id && id != 'new') {
                get().then(value => exec && setValue(value)).catch(() => exec && setValue(undefined))
            } else {
                setValue(undefined)
            }
        }
        const interval = setInterval(update, 1000 * 60)
        return () => { clearInterval(interval), exec = false }
    })

    return value
}

export function useUser(userId: string) {
    return useEntity(
        userId,
        () => UserManager.getUserFromCache(userId),
        () => UserManager.getUser(userId)
    )
}

export function useProduct(productId: string) {
    return useEntity(
        productId,
        () => ProductManager.getProductFromCache(productId),
        () => ProductManager.getProduct(productId)
    )
}

export function useVersion(versionId: string) {
    return useEntity(
        versionId,
        () => VersionManager.getVersionFromCache(versionId),
        () => VersionManager.getVersion(versionId)
    )
}

export function useIssue(issueId: string) {
    return useEntity(
        issueId,
        () => IssueManager.getIssueFromCache(issueId),
        () => IssueManager.getIssue(issueId)
    )
}

export function useMilestone(milestoneId: string) {
    return useEntity(
        milestoneId,
        () => MilestoneManager.getMilestoneFromCache(milestoneId),
        () => MilestoneManager.getMilestone(milestoneId)
    )
}

export function useMember(memberId: string) {
    return useEntity(
        memberId,
        () => MemberManager.getMemberFromCache(memberId),
        () => MemberManager.getMember(memberId)
    )
}