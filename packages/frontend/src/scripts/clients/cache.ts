import { JWK } from "jose"

import { Comment, Issue, Member, Milestone, Product, User, Version } from "productboard-common"

import { CommentClient } from "./rest/comment"
import { FileClient } from "./rest/file"
import { IssueClient } from "./rest/issue"
import { KeyClient } from "./rest/key"
import { MemberClient } from "./rest/member"
import { MilestoneClient } from "./rest/milestone"
import { ProductClient } from "./rest/product"
import { UserClient } from "./rest/user"
import { VersionClient } from "./rest/version"

type IdIndex = { [id: string]: boolean }

// Requests

let PUBLIC_JWK_REQUEST: Promise<JWK> = undefined

const USER_REQUEST: { [userId: string]: Promise<User> } = {}
const PRODUCT_REQUEST: { [productId: string]: Promise<Product> } = {}
const MEMBER_REQUEST: { [memberId: string]: Promise<Member> } = {}
const ISSUE_REQUEST: { [issueId: string]: Promise<Issue> } = {}
const COMMENT_REQUEST: { [commentId: string]: Promise<Comment> } = {}
const MILESTONE_REQUEST: { [milestoneId: string]: Promise<Milestone> } = {}
const VERSION_REQUEST: { [versionId: string]: Promise<Version> } = {}
const FILE_REQUEST: { [fileId: string]: Promise<ArrayBuffer> } = {}

const MEMBERS_REQUEST: { [productId: string]: Promise<Member[]> } = {}
const ISSUES_REQUEST: { [productId: string]: Promise<Issue[]> } = {}
const COMMENTS_REQUEST: { [productId: string]: { [issueId: string]: Promise<Comment[]> } } = {}
const MILESTONES_REQUEST: { [productId: string]: Promise<Milestone[]> } = {}
const VERSIONS_REQUEST: { [productId: string]: Promise<Version[]> } = {}

// Responses

let PUBLIC_JWK_CACHE: JWK = undefined

const USER_CACHE: { [userId: string]: User } = {}
const PRODUCT_CACHE: { [productId: string]: Product } = {}
const MEMBER_CACHE: { [memberId: string]: Member } = {}
const ISSUE_CACHE: { [issueId: string]: Issue } = {}
const COMMENT_CACHE: { [commentId: string]: Comment } = {}
const MILESTONE_CACHE: { [milestoneId: string]: Milestone } = {}
const VERSION_CACHE: { [versionId: string]: Version } = {}

const FILE_CACHE: { [fileId: string]: ArrayBuffer } = {}

const MEMBERS_CACHE: { [productId: string]: IdIndex } = {}
const ISSUES_CACHE: { [productId: string]: IdIndex } = {}
const COMMENTS_CACHE: { [productId: string]: { [issueId: string]: IdIndex } } = {}
const MILESTONES_CACHE: { [productId: string]: IdIndex } = {}
const VERSIONS_CACHE: { [productId: string]: IdIndex } = {}

function compare<T extends { created: number }>(a: T, b: T) {
    return a.created - b.created
}

export const CacheAPI = {

    // Load entity

    async loadPublicJWK() {
        return PUBLIC_JWK_CACHE || PUBLIC_JWK_REQUEST || (PUBLIC_JWK_REQUEST = KeyClient.getPublicJWK().then(CacheAPI.putPublicJWK))
    },
    async loadUser(userId: string) {
        const key = `${userId}`
        return USER_CACHE[key] || USER_REQUEST[key] || (USER_REQUEST[key] = UserClient.getUser(userId).then(CacheAPI.putUser))
    },
    async loadProduct(productId: string) {
        const key = `${productId}`
        return PRODUCT_CACHE[key] || PRODUCT_REQUEST[key] || (PRODUCT_REQUEST[key] = ProductClient.getProduct(productId).then(CacheAPI.putProduct))
    },
    async loadMember(productId: string, memberId: string) {
        const key = `${productId}-${memberId}`
        return MEMBER_CACHE[key] || MEMBER_REQUEST[key] || (MEMBER_REQUEST[key] = MemberClient.getMember(productId, memberId).then(CacheAPI.putMember))
    },
    async loadIssue(productId: string, issueId: string) {
        const key = `${productId}-${issueId}`
        return ISSUE_CACHE[key] || ISSUE_REQUEST[key] || (ISSUE_REQUEST[key] = IssueClient.getIssue(productId, issueId).then(CacheAPI.putIssue))
    },
    async loadComment(productId: string, issueId: string, commentId: string) {
        const key = `${productId}-${issueId}-${commentId}`
        return COMMENT_CACHE[key] || COMMENT_REQUEST[key] || (COMMENT_REQUEST[key] = CommentClient.getComment(productId, issueId, commentId).then(CacheAPI.putComment))
    },
    async loadMilestone(productId: string, milestoneId: string) {
        const key = `${productId}-${milestoneId}`
        return MILESTONE_CACHE[key] || MILESTONE_REQUEST[key] || (MILESTONE_REQUEST[key] = MilestoneClient.getMilestone(productId, milestoneId).then(CacheAPI.putMilestone))
    },
    async loadVersion(productId: string, versionId: string) {
        const key = `${productId}-${versionId}`
        return VERSION_CACHE[key] || VERSION_REQUEST[key] || (VERSION_REQUEST[key] = VersionClient.getVersion(productId, versionId).then(CacheAPI.putVersion))
    },
    async loadFile(fileId: string) {
        const key = `${fileId}`
        return FILE_CACHE[key] || FILE_REQUEST[key] || (FILE_REQUEST[key] = FileClient.getFile(fileId).then(file => CacheAPI.putFile(fileId, file)))
    },

    // Load entities

    async loadMembers(productId: string) {
        if (!(productId in MEMBERS_CACHE)) {
            if (!(productId in MEMBERS_REQUEST)) {
                MEMBERS_REQUEST[productId] = MemberClient.findMembers(productId).then(members => {
                    MEMBERS_CACHE[productId] = {}
                    for (const member of members) {
                        CacheAPI.putMember(member)
                    }
                    return CacheAPI.getMembers(productId)
                })
            }
            return MEMBERS_REQUEST[productId]
        }
        return CacheAPI.getMembers(productId)
    },
    async loadIssues(productId: string) {
        if (!(productId in ISSUES_CACHE)) {
            if (!(productId in ISSUES_REQUEST)) {
                ISSUES_REQUEST[productId] = IssueClient.findIssues(productId).then(issues => {
                    MEMBERS_CACHE[productId] = {}
                    for (const issue of issues) {
                        CacheAPI.putIssue(issue)
                    }
                    return CacheAPI.getIssues(productId)
                })
            }
            return ISSUES_REQUEST[productId]
        }
        return CacheAPI.getIssues(productId)
    },
    async loadComments(productId: string, issueId: string) {
        if (!(productId in COMMENTS_CACHE)) {
            COMMENTS_CACHE[productId] = {}
        }
        if (!(issueId in COMMENTS_CACHE[productId])) {
            if (!(productId in COMMENTS_REQUEST)) {
                COMMENTS_REQUEST[productId] = {}
            }
            if (!(issueId in COMMENTS_REQUEST[productId])) {
                COMMENTS_REQUEST[productId][issueId] = CommentClient.findComments(productId, issueId).then(comments => {
                    COMMENTS_CACHE[productId][issueId] = {}
                    for (const comment of comments) {
                        CacheAPI.putComment(comment)
                    }
                    return CacheAPI.getComments(productId, issueId)
                })
            }
            return COMMENTS_REQUEST[productId][issueId]
        }
        return CacheAPI.getComments(productId, issueId)
    },
    async loadMilestones(productId: string) {
        if (!(productId in MILESTONES_CACHE)) {
            if (!(productId in MILESTONES_REQUEST)) {
                MILESTONES_REQUEST[productId] = MilestoneClient.findMilestones(productId).then(milestones => {
                    MILESTONES_CACHE[productId] = {}
                    for (const milestone of milestones) {
                        CacheAPI.putMilestone(milestone)
                    }
                    return CacheAPI.getMilestones(productId)
                })
            }
            return MILESTONES_REQUEST[productId]
        }
        return CacheAPI.getMilestones(productId)
    },
    async loadVersions(productId: string) {
        if (!(productId in VERSIONS_CACHE)) {
            if (!(productId in VERSIONS_REQUEST)) {
                VERSIONS_REQUEST[productId] = VersionClient.findVersions(productId).then(versions => {
                    VERSIONS_CACHE[productId] = {}
                    for (const version of versions) {
                        CacheAPI.putVersion(version)
                    }
                    return CacheAPI.getVersions(productId)
                })
            }
            return VERSIONS_REQUEST[productId]
        }
        return CacheAPI.getVersions(productId)
    },

    // Get entity

    getPublicJWK() {
        return PUBLIC_JWK_CACHE
    },
    getUser(userId: string) {
        return USER_CACHE[userId]
    },
    getProduct(productId: string) {
        return PRODUCT_CACHE[productId]
    },
    getMember(productId: string, memberId: string) {
        return MEMBER_CACHE[`${productId}-${memberId}`]
    },
    getIssue(productId: string, issueId: string) {
        return ISSUE_CACHE[`${productId}-${issueId}`]
    },
    getComment(productId: string, issueId: string, commentId: string) {
        return COMMENT_CACHE[`${productId}-${issueId}-${commentId}`]
    },
    getMilestone(productId: string, milestoneId: string) {
        return MILESTONE_CACHE[`${productId}-${milestoneId}`]
    },
    getVersion(productId: string, versionId: string) {
        return VERSION_CACHE[`${productId}-${versionId}`]
    },
    getFile(fileId: string) {
        return FILE_CACHE[fileId]
    },

    // Get entities

    getMembers(productId: string) {
        if (productId in MEMBERS_CACHE) {
            const memberIds = Object.keys(MEMBERS_CACHE[productId])
            const members = memberIds.map(memberId => MEMBER_CACHE[`${productId}-${memberId}`])
            return members.filter(member => !member.deleted).sort(compare)
        }
        return null
    },
    getIssues(productId: string) {
        if (productId in ISSUES_CACHE) {
            const issueIds = Object.keys(ISSUES_CACHE[productId])
            const issues = issueIds.map(issueId => ISSUE_CACHE[`${productId}-${issueId}`])
            return issues.filter(issue => !issue.deleted).sort(compare)
        }
        return null
    },
    getComments(productId: string, issueId: string) {
        if (productId in COMMENTS_CACHE) {
            if (issueId in COMMENTS_CACHE[productId]) {
                const commentIds = Object.keys(COMMENTS_CACHE[productId][issueId])
                const comments = commentIds.map(commentId => COMMENT_CACHE[`${productId}-${issueId}-${commentId}`])
                return comments.filter(comment => !comment.deleted).sort(compare)
            }
        }
        return null
    },
    getMilestones(productId: string) {
        if (productId in MILESTONES_CACHE) {
            const milestoneIds = Object.keys(MILESTONES_CACHE[productId])
            const milestones = milestoneIds.map(milestoneId => MILESTONE_CACHE[`${productId}-${milestoneId}`])
            return milestones.filter(milestone => !milestone.deleted).sort(compare)
        }
        return null
    },
    getVersions(productId: string) {
        if (productId in VERSIONS_CACHE) {
            const versionIds = Object.keys(VERSIONS_CACHE[productId])
            const versions = versionIds.map(versionId => VERSION_CACHE[`${productId}-${versionId}`])
            return versions.filter(version => !version.deleted).sort(compare)
        }
        return null
    },

    // Put entity and update list

    putPublicJWK(key: JWK) {
        PUBLIC_JWK_CACHE = key
        return key
    },
    putUser(user: User) {
        USER_CACHE[user.userId] = user
        return user
    },
    putProduct(product: Product) {
        PRODUCT_CACHE[product.productId] = product
        return product
    },
    putMember(member: Member) {
        MEMBER_CACHE[`${member.productId}-${member.memberId}`] = member
        if (member.productId in MEMBERS_CACHE) {
            MEMBERS_CACHE[member.productId][member.memberId] = true
        }
        return member
    },
    putIssue(issue: Issue) {
        ISSUE_CACHE[`${issue.productId}-${issue.issueId}`] = issue
        if (issue.productId in ISSUES_CACHE) {
            ISSUES_CACHE[issue.productId][issue.issueId] = true
        }
        return issue
    },
    putComment(comment: Comment) {
        COMMENT_CACHE[`${comment.productId}-${comment.issueId}-${comment.commentId}`] = comment
        if (comment.productId in COMMENTS_CACHE) {
            if (comment.issueId in COMMENTS_CACHE[comment.productId]) {
                COMMENTS_CACHE[comment.productId][comment.issueId][comment.commentId] = true
            }
        }
        return comment
    },
    putMilestone(milestone: Milestone) {
        MILESTONE_CACHE[`${milestone.productId}-${milestone.milestoneId}`] = milestone
        if (milestone.productId in MILESTONES_CACHE) {
            MILESTONES_CACHE[milestone.productId][milestone.milestoneId] = true
        }
        return milestone
    },
    putVersion(version: Version) {
        VERSION_CACHE[`${version.productId}-${version.versionId}`] = version
        if (version.productId in VERSIONS_CACHE) {
            VERSIONS_CACHE[version.productId][version.versionId] = true
        }
        return version
    },
    putFile(fileId: string, file: ArrayBuffer) {
        FILE_CACHE[fileId] = file
        return file
    },

    // Other

    clear() {
        // TODO clear!
    }
}