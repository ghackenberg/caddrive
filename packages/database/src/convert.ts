import { CommentEntity } from "./entities/comment"
import { IssueEntity } from "./entities/issue"
import { MemberEntity } from "./entities/member"
import { MilestoneEntity } from "./entities/milestone"
import { ProductEntity } from "./entities/product"
import { UserEntity } from "./entities/user"
import { VersionEntity } from "./entities/version"

export function convertUser(user: UserEntity, full: boolean) {
    return {
        userId: user.userId,
        created: user.created,
        updated: user.updated,
        deleted: user.deleted,
        pictureId: user.pictureId,
        email: full ? user.email : null,
        consent: user.consent,
        name: user.name
    }
}

export function convertProduct(product: ProductEntity) {
    return {
        productId: product.productId,
        created: product.created,
        updated: product.updated,
        deleted: product.deleted,
        userId: product.userId,
        name: product.name,
        description: product.description,
        public: product.public
    }
}

export function convertVersion(version: VersionEntity) {
    return {
        productId: version.productId,
        versionId: version.versionId,
        created: version.created,
        updated: version.updated,
        deleted: version.deleted,
        userId: version.userId,
        baseVersionIds: version.baseVersionIds,
        major:version.major,
        minor: version.minor,
        patch: version.patch,
        description: version.description,
        modelType: version.modelType,
        imageType: version.imageType
    }
}

export function convertIssue(issue: IssueEntity) {
    return {
        productId: issue.productId,
        issueId: issue.issueId,
        created: issue.created,
        updated: issue.updated,
        deleted: issue.deleted,
        userId: issue.userId,
        milestoneId: issue.milestoneId,
        assignedUserIds: issue.assignedUserIds,
        label: issue.label,
        state: issue.state
    }
}

export function convertComment(comment: CommentEntity) {
    return {
        productId: comment.productId,
        issueId: comment.issueId,
        commentId: comment.commentId,
        created: comment.created,
        updated: comment.updated,
        deleted: comment.deleted,
        userId: comment.userId,
        audioId: comment.audioId,
        text: comment.text,
        action: comment.action
    }
}

export function convertMilestone(milestone: MilestoneEntity) {
    return {
        productId: milestone.productId,
        milestoneId: milestone.milestoneId,
        created: milestone.created,
        updated: milestone.updated,
        deleted: milestone.deleted,
        userId: milestone.userId,
        label: milestone.label,
        start: milestone.start,
        end: milestone.end
    }
}

export function convertMember(member: MemberEntity) {
    return {
        productId: member.productId,
        memberId: member.memberId,
        created: member.created,
        updated: member.updated,
        deleted: member.deleted,
        userId: member.userId,
        role: member.role
    }
}