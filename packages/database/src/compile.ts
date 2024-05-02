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

async function process<T extends { created: number }, S extends { created: number }>(array: T[], value: (data: T) => Promise<S>) {
    const result: S[] = []
    for (const item of array || []) {
        result.push(await value(item))
    }
    return result.sort((a, b) => a.created - b.created)
}

export async function compileUserMessage(data: UserMessageData): Promise<UserMessage> {
    return {
        type: data.type,
        users: await process(data.users, user => convertUser(user, false))
    }
}
export async function compileProductMessage(data: ProductMessageData): Promise<ProductMessage> {
    return {
        type: data.type,
        products: await process(data.products, convertProduct),
        members: await process(data.members, convertMember),
        issues: await process(data.issues, convertIssue),
        comments: await process(data.comments, convertComment),
        attachments: await process(data.attachments, convertAttachment),
        milestones: await process(data.milestones, convertMilestone),
        versions: await process(data.versions, convertVersion)
    }
}