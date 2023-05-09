import { CommentEntity, IssueEntity, MemberEntity, MilestoneEntity, ProductEntity, UserEntity, VersionEntity } from "productboard-database"

export function convertUser(user: UserEntity, full: boolean) {
    return {
        id: user.id,
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
        id: product.id,
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
        id: version.id,
        created: version.created,
        updated: version.updated,
        deleted: version.deleted,
        userId: version.userId,
        productId: version.productId,
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
        id: issue.id,
        created: issue.created,
        updated: issue.updated,
        deleted: issue.deleted,
        userId: issue.userId,
        productId: issue.productId,
        milestoneId: issue.milestoneId,
        assigneeIds: issue.assigneeIds,
        audioId: issue.audioId,
        label: issue.label,
        text: issue.text,
        state: issue.state
    }
}

export function convertComment(comment: CommentEntity) {
    return {
        id: comment.id,
        created: comment.created,
        updated: comment.updated,
        deleted: comment.deleted,
        userId: comment.userId,
        issueId: comment.issueId,
        audioId: comment.audioId,
        text: comment.text,
        action: comment.action
    }
}

export function convertMilestone(milestone: MilestoneEntity) {
    return {
        id: milestone.id,
        created: milestone.created,
        updated: milestone.updated,
        deleted: milestone.deleted,
        userId: milestone.userId,
        productId: milestone.productId,
        label: milestone.label,
        start: milestone.start,
        end: milestone.end
    }
}

export function convertMember(member: MemberEntity) {
    return {
        id: member.id,
        created: member.created,
        updated: member.updated,
        deleted: member.deleted,
        userId: member.userId,
        productId: member.productId,
        role: member.role
    }
}