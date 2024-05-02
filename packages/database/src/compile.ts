import { ProductMessage, UserMessage } from "productboard-common"

import { convertAttachment, convertComment, convertIssue, convertMember, convertMilestone, convertProduct, convertUser, convertVersion } from "./convert"
import { AttachmentEntity } from "./entities/attachment"
import { CommentEntity } from "./entities/comment"
import { IssueEntity } from "./entities/issue"
import { MemberEntity } from "./entities/member"
import { MilestoneEntity } from "./entities/milestone"
import { ProductEntity } from "./entities/product"
import { UserEntity } from "./entities/user"
import { VersionEntity } from "./entities/version"

export type UserMessageData = {
    type: 'state' | 'patch'
    users?: UserEntity[]
}
export type ProductMessageData = {
    type: 'state' | 'patch'
    products?: ProductEntity[]
    members?: MemberEntity[],
    issues?: IssueEntity[],
    comments?: CommentEntity[],
    attachments?: AttachmentEntity[],
    milestones?: MilestoneEntity[],
    versions?: VersionEntity[]
}

function process<T extends { created: number }, S extends { created: number }>(array: T[], value: (data: T) => S) {
    return array && array.map(item => value(item)).sort((a, b) => a.created - b.created)
}

export function compileUserMessage(data: UserMessageData): UserMessage {
    return {
        type: data.type,
        users: process(data.users, user => convertUser(user, false))
    }
}
export function compileProductMessage(data: ProductMessageData): ProductMessage {
    return {
        type: data.type,
        products: process(data.products, convertProduct),
        members: process(data.members, convertMember),
        issues: process(data.issues, convertIssue),
        comments: process(data.comments, convertComment),
        attachments: process(data.attachments, convertAttachment),
        milestones: process(data.milestones, convertMilestone),
        versions: process(data.versions, convertVersion)
    }
}