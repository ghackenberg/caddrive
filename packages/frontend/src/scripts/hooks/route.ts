import * as React from 'react'
import { useParams } from 'react-router'

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

function useEntity<T extends { id: string }>(id: string, cache: (id: string) => T, get: (id: string) => Promise<T>, api: AbstractClient<{ create: (e: T) => void, update: (e: T) => void, delete: (e: T) => void }>) {
    const initialValue = id && id != 'new' && cache(id)

    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        id && id != 'new' && !value && get(id).then(value => exec && setValue(value))
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

function useEntities<T extends { id: string }>(cache: () => T[], get: () => Promise<T[]>, api: AbstractClient<{ create: (e: T) => void, update: (e: T) => void, delete: (e: T) => void }>) {
    const initialValue = cache()

    const [values, setValues] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        !values && get().then(values => exec && setValues(values))
        return () => { exec = false }
    })

    React.useEffect(() => {
        return api.register({
            create(e) {
                if (values) {
                    setValues([...values.filter(other => other.id != e.id), e])
                }
            },
            update(e) {
                if (values) {
                    setValues(values.map(other => other.id == e.id ? e : other))
                }
            },
            delete(e) {
                if (values) {
                    setValues(values.filter(other => other.id != e.id))
                }
            }
        })
    })

    return values
}

function useChildEntities<T extends { id: string }>(parentId: string, parent: (e: T) => string, cache: (parentId: string) => T[], get: (parentId: string) => Promise<T[]>, api: AbstractClient<{ create: (e: T) => void, update: (e: T) => void, delete: (e: T) => void }>) {
    const initialValue = parentId && parentId != 'new' && cache(parentId)

    const [values, setValues] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        parentId && parentId != 'new' && !values && get(parentId).then(values => exec && setValues(values))
        return () => { exec = false }
    }, [parentId])

    React.useEffect(() => {
        return api.register({
            create(e) {
                if (values && parent(e) == parentId) {
                    setValues([...values.filter(other => other.id != e.id), e])
                }
            },
            update(e) {
                if (values && parent(e) == parentId) {
                    setValues(values.map(other => other.id == e.id ? e : other))
                }
            },
            delete(e) {
                if (values && parent(e) == parentId) {
                    setValues(values.filter(other => other.id != e.id))
                }
            }
        })
    })

    return values
}

// USERS

export function useRouteUsers() {
    const users = useEntities(() => UserManager.findUsersFromCache(), () => UserManager.findUsers(), UserAPI)

    return { users }
}

export function useRouteUser() {
    const { userId } = useParams<{ userId: string }>()

    const user = useEntity(userId, id => UserManager.getUserFromCache(id), id => UserManager.getUser(id), UserAPI)

    return { userId, user }
}

// PRODUCTS

export function useRouteProducts() {
    const products = useEntities(() => ProductManager.findProductsFromCache(), () => ProductManager.findProducts(), ProductAPI)

    return { products }
}

export function useRouteProduct() {
    const { productId } = useParams<{ productId: string }>()

    const product = useEntity(productId, id => ProductManager.getProductFromCache(id), id => ProductManager.getProduct(id), ProductAPI)
    
    return { productId, product }
}

// VERSIONS

export function useRouteVersions() {
    const { productId } = useParams<{ productId: string }>()

    const versions = useChildEntities(productId, version => version.productId, id => VersionManager.findVersionsFromCache(id), id => VersionManager.findVersions(id), VersionAPI)

    return { productId, versions }
}

export function useRouteVersion() {
    const { versionId } = useParams<{ versionId: string }>()

    const version = useEntity(versionId, id => VersionManager.getVersionFromCache(id), id => VersionManager.getVersion(id), VersionAPI)

    return { versionId, version }
}

// ISSUES

export function useRouteIssues() {
    const { productId } = useParams<{ productId: string }>()

    const issues = useChildEntities(productId, issue => issue.productId, id => IssueManager.findIssuesFromCache(id), id => IssueManager.findIssues(id), IssueAPI)

    return { productId, issues}
}

export function useRouteIssue() {
    const { issueId } = useParams<{ issueId: string }>()

    const issue = useEntity(issueId, id => IssueManager.getIssueFromCache(id), id => IssueManager.getIssue(id), IssueAPI)

    return { issueId, issue }
}

// COMMENTS

export function useRouteComments() {
    const { issueId } = useParams<{ issueId: string }>()

    const comments = useChildEntities(issueId, comment => comment.issueId, id => CommentManager.findCommentsFromCache(id), id => CommentManager.findComments(id), CommentAPI)

    return { issueId, comments }
}

// MILESTONE

export function useRouteMilestones() {
    const { productId } = useParams<{ productId: string }>()

    const milestones = useChildEntities(productId, milestone => milestone.productId, id => MilestoneManager.findMilestonesFromCache(id), id => MilestoneManager.findMilestones(id), MilestoneAPI)

    return { productId, milestones }
}

export function useRouteMilestone() {
    const { milestoneId } = useParams<{ milestoneId: string }>()

    const milestone = useEntity(milestoneId, id => MilestoneManager.getMilestoneFromCache(id), id => MilestoneManager.getMilestone(id), MilestoneAPI)

    return { milestoneId, milestone }
}

// MEMBER

export function useRouteMembers() {
    const { productId } = useParams<{ productId: string }>()

    const members = useChildEntities(productId, member => member.productId, id => MemberManager.findMembersFromCache(id), id => MemberManager.findMembers(id), MemberAPI)

    return { productId, members }
}

export function useRouteMember() {
    const { memberId } = useParams<{ memberId: string }>()

    const member = useEntity(memberId, id => MemberManager.getMemberFromCache(id), id => MemberManager.getMember(id), MemberAPI)

    return { memberId, member }
}