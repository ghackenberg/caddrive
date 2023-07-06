import { ProductMessage, UserMessage } from "productboard-common"

import { convertComment, convertIssue, convertMember, convertMilestone, convertProduct, convertUser, convertVersion } from "./convert"
import { CommentEntity } from "./entities/comment"
import { IssueEntity } from "./entities/issue"
import { MemberEntity } from "./entities/member"
import { MilestoneEntity } from "./entities/milestone"
import { ProductEntity } from "./entities/product"
import { UserEntity } from "./entities/user"
import { VersionEntity } from "./entities/version"

export type UserMessageData = {
    users?: UserEntity[]
}
export type ProductMessageData = {
    products?: ProductEntity[]
    members?: MemberEntity[],
    issues?: IssueEntity[],
    comments?: CommentEntity[],
    milestones?: MilestoneEntity[],
    versions?: VersionEntity[]
}

function process<T, S>(array: T[], key: (data: T) => string, value: (data: T) => S) {
    if (array) {
        const result: { [id: string]: S } = {}
        for (const item of array) {
            result[key(item)] = value(item)
        }
        return result
    } else {
        return undefined
    }
}

export function compileUserMessage(data: UserMessageData): UserMessage {
    return {
        users: process(data.users, user => user.userId, user => convertUser(user, false))
    }
}
export function compileProductMessage(data: ProductMessageData): ProductMessage {
    return {
        products: process(data.products, product => product.productId, convertProduct),
        members: process(data.members, member => `${member.productId}-${member.memberId}`, convertMember),
        issues: process(data.issues, issue => `${issue.productId}-${issue.issueId}`, convertIssue),
        comments: process(data.comments, comment => `${comment.productId}-${comment.issueId}-${comment.commentId}`, convertComment),
        milestones: process(data.milestones, milestone => `${milestone.productId}-${milestone.milestoneId}`, convertMilestone),
        versions: process(data.versions, version => `${version.productId}-${version.versionId}`, convertVersion)
    }
}