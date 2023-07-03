import { CommentEntity, IssueEntity, MemberEntity, MilestoneEntity, ProductEntity, UserEntity, VersionEntity } from "productboard-database"

import { convertComment, convertIssue, convertMember, convertMilestone, convertProduct, convertUser, convertVersion } from "./convert"
import { MqttAPI } from "../mqtt"

export async function emitComment(comment: CommentEntity) {
    (await MqttAPI).publish(`/products/${comment.productId}/issues/${comment.issueId}/comments/${comment.commentId}`, JSON.stringify(convertComment(comment)))
}

export async function emitIssue(issue: IssueEntity) {
    (await MqttAPI).publish(`/products/${issue.productId}/issues/${issue.issueId}`, JSON.stringify(convertIssue(issue)))
}

export async function emitMember(member: MemberEntity) {
    (await MqttAPI).publish(`/products/${member.productId}/members/${member.memberId}`, JSON.stringify(convertMember(member)))
}

export async function emitMilestone(milestone: MilestoneEntity) {
    (await MqttAPI).publish(`/products/${milestone.productId}/milestones/${milestone.milestoneId}`, JSON.stringify(convertMilestone(milestone)))
}

export async function emitProduct(product: ProductEntity) {
    (await MqttAPI).publish(`/products/${product.productId}`, JSON.stringify(convertProduct(product)))
}

export async function emitVersion(version: VersionEntity) {
    (await MqttAPI).publish(`/products/${version.productId}/versions/${version.versionId}`, JSON.stringify(convertVersion(version)))
}

export async function emitUser(user: UserEntity) {
    (await MqttAPI).publish(`/users/${user.userId}`, JSON.stringify(convertUser(user, false)))
}