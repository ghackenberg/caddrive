import * as React from 'react'

import { AbstractClient } from '../clients/mqtt/abstract'
import { IssueAPI } from '../clients/mqtt/issue'
import { MemberAPI } from '../clients/mqtt/member'
import { MilestoneAPI } from '../clients/mqtt/milestone'
import { ProductAPI } from '../clients/mqtt/product'
import { UserAPI } from '../clients/mqtt/user'
import { VersionAPI } from '../clients/mqtt/version'
import { IssueManager } from '../managers/issue'
import { MemberManager } from '../managers/member'
import { MilestoneManager } from '../managers/milestone'
import { ProductManager } from '../managers/product'
import { UserManager } from '../managers/user'
import { VersionManager } from '../managers/version'

function useEntity<T extends { id: string }>(id: string, cache: () => T, get: () => Promise<T>, api: AbstractClient<{ create: (e: T) => void, update: (e: T) => void, delete: (e: T) => void }>) {
    const initialValue = id && id != 'new' && cache()

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        id && id != 'new' && !value && get().then(value => exec && setValue(value))
        return () => { exec = false}
    }, [id])

    React.useEffect(() => {
        return api.register({
            create(e) {
                e.id == id && setValue(e)
            },
            update(e) {
                e.id == id && setValue(e)
            },
            delete(e) {
                e.id == id && setValue(e)
            }
        })
    })

    return value
}

export function useUser(userId: string) {
    return useEntity(userId, () => UserManager.getUserFromCache(userId), () => UserManager.getUser(userId), UserAPI)
}

export function useProduct(productId: string) {
    return useEntity(productId, () => ProductManager.getProductFromCache(productId), () => ProductManager.getProduct(productId), ProductAPI)
}

export function useVersion(versionId: string) {
    return useEntity(versionId, () => VersionManager.getVersionFromCache(versionId), () => VersionManager.getVersion(versionId), VersionAPI)
}

export function useIssue(issueId: string) {
    return useEntity(issueId, () => IssueManager.getIssueFromCache(issueId), () => IssueManager.getIssue(issueId), IssueAPI)
}

export function useMilestone(milestoneId: string) {
    return useEntity(milestoneId, () => MilestoneManager.getMilestoneFromCache(milestoneId), () => MilestoneManager.getMilestone(milestoneId), MilestoneAPI)
}

export function useMember(memberId: string) {
    return useEntity(memberId, () => MemberManager.getMemberFromCache(memberId), () => MemberManager.getMember(memberId), MemberAPI)
}