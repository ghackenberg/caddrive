import { ProductMessage, UserMessage } from "productboard-common"
import { CommentEntity, IssueEntity, MemberEntity, MilestoneEntity, ProductEntity, UserEntity, VersionEntity } from "productboard-database"

import { convertComment, convertIssue, convertMember, convertMilestone, convertProduct, convertUser, convertVersion } from "./convert"
import { MqttAPI } from "../mqtt"

type UserMessageData = {
    users?: UserEntity[]
}
type ProductMessageData = {
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

function compileUserMessage(data: UserMessageData): UserMessage {
    return {
        users: process(data.users, user => user.userId, user => convertUser(user, false))
    }
}
function compileProductMessage(data: ProductMessageData): ProductMessage {
    return {
        products: process(data.products, product => product.productId, convertProduct),
        members: process(data.members, member => `${member.productId}-${member.memberId}`, convertMember),
        issues: process(data.issues, issue => `${issue.productId}-${issue.issueId}`, convertIssue),
        comments: process(data.comments, comment => `${comment.productId}-${comment.issueId}-${comment.commentId}`, convertComment),
        milestones: process(data.milestones, milestone => `${milestone.productId}-${milestone.milestoneId}`, convertMilestone),
        versions: process(data.versions, version => `${version.productId}-${version.versionId}`, convertVersion)
    }
}

export async function emitUserMessage(userId: string, data: UserMessageData) {
    const message = compileUserMessage(data);
    (await MqttAPI).publish(`/users/${userId}`, JSON.stringify(message))
}
export async function emitProductMessage(productId: string, data: ProductMessageData) {
    const message = compileProductMessage(data);
    (await MqttAPI).publish(`/products/${productId}`, JSON.stringify(message))
}