import * as React from 'react'
import { useParams } from 'react-router'

import { Comment } from 'productboard-common'

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

function useChildEntities<T extends { id: string }>(parentId: string, parent: (e: T) => string, cache: () => T[], get: () => Promise<T[]>, api: AbstractClient<{ create: (e: T) => void, update: (e: T) => void, delete: (e: T) => void }>) {
    const initialValue = parentId && parentId != 'new' && cache()

    const [values, setValues] = React.useState(initialValue)

    React.useEffect(() => {
        let exec = true
        parentId && parentId != 'new' && !values && get().then(values => exec && setValues(values))
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

export function useUsers() {
    return useEntities(() => UserManager.findUsersFromCache(), () => UserManager.findUsers(), UserAPI)
}

export function useUser(userId: string) {
    return useEntity(userId, () => UserManager.getUserFromCache(userId), () => UserManager.getUser(userId), UserAPI)
}

// PRODUCTS

export function useProducts() {
    return useEntities(() => ProductManager.findProductsFromCache(), () => ProductManager.findProducts(), ProductAPI)
}

export function useProduct(productId: string) {
    return useEntity(productId, () => ProductManager.getProductFromCache(productId), () => ProductManager.getProduct(productId), ProductAPI)
}

// VERSIONS

export function useVersions(productId: string) {
    return useChildEntities(productId, version => version.productId, () => VersionManager.findVersionsFromCache(productId), () => VersionManager.findVersions(productId), VersionAPI)
}

export function useVersion(versionId: string) {
    return useEntity(versionId, () => VersionManager.getVersionFromCache(versionId), () => VersionManager.getVersion(versionId), VersionAPI)
}

// ISSUES

export function useProductIssues(productId: string) {
    return useChildEntities(productId, issue => issue.productId, () => IssueManager.findIssuesFromCache(productId), () => IssueManager.findIssues(productId), IssueAPI)
}

export function useMilestoneIssues(productId: string, milestoneId: string) {
    return useChildEntities(milestoneId, issue => issue.milestoneId, () => IssueManager.findIssuesFromCache(productId, milestoneId), () => IssueManager.findIssues(productId, milestoneId), IssueAPI)
}

export function useIssue(issueId: string) {
    return useEntity(issueId, () => IssueManager.getIssueFromCache(issueId), () => IssueManager.getIssue(issueId), IssueAPI)
}

// COMMENTS

export function useMilestoneIssueComments(productId: string, milestoneId: string) {
    const issues = useMilestoneIssues(productId, milestoneId)

    const initialComments: {[issueId: string]: Comment[]} = {}
    for (const issue of issues || []) {
        initialComments[issue.id] = CommentManager.findCommentsFromCache(issue.id)
    }

    const [comments, setComments] = React.useState(initialComments)

    React.useEffect(() => {
        let exec = true
        if (issues) {
            Promise.all(issues.map(issue => CommentManager.findComments(issue.id))).then(comments => {
                if (exec) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    issues.forEach((issue, index) => {
                        newComments[issue.id] = comments[index]
                    })
                    setComments(newComments)
                }
            })
        }
        return () => { exec = false }
    }, [issues])

    React.useEffect(() => {
        return CommentAPI.register({
            create(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = [...comments[issue.id].filter(other => other.id != comment.id), comment]
                        } else {
                            newComments[issue.id] = [...comments[issue.id]]
                        }
                    }
                    setComments(newComments)
                }
            },
            update(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = comments[issue.id].map(other => other.id == comment.id ? comment : other)
                        } else {
                            newComments[issue.id] = [...comments[issue.id]]
                        }
                    }
                    setComments(newComments)
                }
            },
            delete(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = comments[issue.id].filter(other => other.id != comment.id)
                        } else {
                            newComments[issue.id] = [...comments[issue.id]]
                        }
                    }
                    setComments(newComments)
                }
            }
        })
    })

    return { milestoneId, comments }
}

export function useProductIssueComments(productId: string) {
    const issues = useProductIssues(productId)

    const initialComments: {[issueId: string]: Comment[]} = {}
    for (const issue of issues || []) {
        initialComments[issue.id] = CommentManager.findCommentsFromCache(issue.id)
    }

    const [comments, setComments] = React.useState(initialComments)

    React.useEffect(() => {
        let exec = true
        if (issues) {
            Promise.all(issues.map(issue => CommentManager.findComments(issue.id))).then(comments => {
                if (exec) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    issues.forEach((issue, index) => {
                        newComments[issue.id] = comments[index]
                    })
                    setComments(newComments)
                }
            })
        }
        return () => { exec = false }
    }, [issues])

    React.useEffect(() => {
        return CommentAPI.register({
            create(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = [...comments[issue.id].filter(other => other.id != comment.id), comment]
                        } else {
                            newComments[issue.id] = [...comments[issue.id]]
                        }
                    }
                    setComments(newComments)
                }
            },
            update(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = comments[issue.id].map(other => other.id == comment.id ? comment : other)
                        } else {
                            newComments[issue.id] = [...comments[issue.id]]
                        }
                    }
                    setComments(newComments)
                }
            },
            delete(comment) {
                if (comments && comment.issueId in comments) {
                    const newComments: {[issueId: string]: Comment[]} = {}
                    for (const issue of issues) {
                        if (issue.id == comment.issueId) {
                            newComments[issue.id] = comments[issue.id].filter(other => other.id != comment.id)
                        } else {
                            newComments[issue.id] = [...comments[issue.id]]
                        }
                    }
                    setComments(newComments)
                }
            }
        })
    })

    return { productId, comments }
}

export function useIssueComments(issueId: string) {
    return useChildEntities(issueId, comment => comment.issueId, () => CommentManager.findCommentsFromCache(issueId), () => CommentManager.findComments(issueId), CommentAPI)
}

// MILESTONE

export function useMilestones(productId: string) {
    return useChildEntities(productId, milestone => milestone.productId, () => MilestoneManager.findMilestonesFromCache(productId), () => MilestoneManager.findMilestones(productId), MilestoneAPI)
}

export function useMilestone(milestoneId: string) {
    return useEntity(milestoneId, () => MilestoneManager.getMilestoneFromCache(milestoneId), () => MilestoneManager.getMilestone(milestoneId), MilestoneAPI)
}

// MEMBER

export function useMembers(productId: string) {
    const members = useChildEntities(productId, member => member.productId, () => MemberManager.findMembersFromCache(productId), () => MemberManager.findMembers(productId), MemberAPI)

    return { productId, members }
}

export function useMember() {
    const { memberId } = useParams<{ memberId: string }>()

    const member = useEntity(memberId, () => MemberManager.getMemberFromCache(memberId), () => MemberManager.getMember(memberId), MemberAPI)

    return { memberId, member }
}