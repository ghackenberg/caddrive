import { CommentEntity, Database, IssueEntity, MemberEntity, MilestoneEntity, ProductEntity, UserEntity, VersionEntity } from "productboard-database"

import { convertComment, convertIssue, convertMember, convertMilestone, convertProduct, convertUser, convertVersion } from "./convert"
import { MqttAPI } from "../mqtt"

export async function emitComment(comment: CommentEntity) {
    const issue = await Database.get().issueRepository.findOneBy({ id: comment.issueId });
    (await MqttAPI).publish(`/products/${issue.productId}/issues/${issue.id}/comments/${comment.id}`, JSON.stringify(convertComment(comment)))
}

export async function emitIssue(issue: IssueEntity) {
    (await MqttAPI).publish(`/products/${issue.productId}/issues/${issue.id}`, JSON.stringify(convertIssue(issue)))
}

export async function emitMember(member: MemberEntity) {
    (await MqttAPI).publish(`/products/${member.productId}/members/${member.id}`, JSON.stringify(convertMember(member)))
}

export async function emitMilestone(milestone: MilestoneEntity) {
    (await MqttAPI).publish(`/products/${milestone.productId}/milestones/${milestone.id}`, JSON.stringify(convertMilestone(milestone)))
}

export async function emitProduct(product: ProductEntity) {
    (await MqttAPI).publish(`/products/${product.id}`, JSON.stringify(convertProduct(product)))
}

export async function emitVersion(version: VersionEntity) {
    const product = await Database.get().versionRepository.findOneBy({ id: version.productId });
    (await MqttAPI).publish(`/products/${product.id}/versions/${version.id}`, JSON.stringify(convertVersion(version)))
}

export async function emitUser(user: UserEntity) {
    (await MqttAPI).publish(`/users/${user.id}`, JSON.stringify(convertUser(user, false)))
}