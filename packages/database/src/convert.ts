import { IsNull } from "typeorm"

import { AttachmentRead, CommentRead, IssueRead, MemberRead, MilestoneRead, ProductRead, UserRead, VersionRead } from "productboard-common"

import { AttachmentEntity } from "./entities/attachment"
import { CommentEntity } from "./entities/comment"
import { IssueEntity } from "./entities/issue"
import { MemberEntity } from "./entities/member"
import { MilestoneEntity } from "./entities/milestone"
import { ProductEntity } from "./entities/product"
import { UserEntity } from "./entities/user"
import { VersionEntity } from "./entities/version"
import { Database } from "./main"

export async function convertUser(user: UserEntity, full: boolean): Promise<UserRead> {
    return {
        userId: user.userId,
        pictureId: user.pictureId,
        created: user.created,
        updated: user.updated,
        deleted: user.deleted,
        email: full ? user.email : null,
        consent: user.consent,
        name: user.name,
        emailNotification: user.emailNotification
    }
}

export async function convertProduct(product: ProductEntity): Promise<ProductRead> {
    
    const versionCount = await Database.get().versionRepository.countBy({ product, deleted: IsNull() })
    const openIssueCount = await Database.get().issueRepository.countBy({ product, state: "open", deleted: IsNull() })
    const closedIssueCount = await Database.get().issueRepository.countBy({ product, state: "closed", deleted: IsNull() })
    const milestoneCount = await Database.get().milestoneRepository.countBy({ product, deleted: IsNull() })
    const memberCount = await Database.get().memberRepository.countBy({ product, deleted: IsNull() })

    return {
        userId: product.userId,
        productId: product.productId,
        created: product.created,
        updated: product.updated,
        deleted: product.deleted,
        name: product.name,
        description: product.description,
        public: product.public,
        versionCount,
        openIssueCount,
        closedIssueCount,
        milestoneCount,
        memberCount
    }
}

export async function convertVersion(version: VersionEntity): Promise<VersionRead> {
    return {
        userId: version.userId,
        productId: version.productId,
        versionId: version.versionId,
        baseVersionIds: version.baseVersionIds,
        created: version.created,
        updated: version.updated,
        deleted: version.deleted,
        major:version.major,
        minor: version.minor,
        patch: version.patch,
        description: version.description,
        modelType: version.modelType,
        imageType: version.imageType
    }
}

export async function convertIssue(issue: IssueEntity): Promise<IssueRead> {
    
    const commentCount = await Database.get().commentRepository.countBy({ issue, deleted: IsNull() })
    const attachmentCount = 0 // TODO compute attachment count
    const partCount = 0 // TODO compute part count

    return {
        userId: issue.userId,
        productId: issue.productId,
        milestoneId: issue.milestoneId,
        assignedUserIds: issue.assignedUserIds,
        issueId: issue.issueId,
        created: issue.created,
        updated: issue.updated,
        deleted: issue.deleted,
        number: issue.number,
        state: issue.state,
        label: issue.label,
        commentCount,
        attachmentCount,
        partCount
    }
}

export async function convertComment(comment: CommentEntity): Promise<CommentRead> {
    return {
        userId: comment.userId,
        productId: comment.productId,
        issueId: comment.issueId,
        commentId: comment.commentId,
        created: comment.created,
        updated: comment.updated,
        deleted: comment.deleted,
        text: comment.text,
        action: comment.action
    }
}

export async function convertAttachment(attachment: AttachmentEntity): Promise<AttachmentRead> {
    return  {
        userId: attachment.userId,
        productId: attachment.productId,
        attachmentId: attachment.attachmentId,
        created: attachment.created,
        updated: attachment.updated,
        deleted: attachment.deleted,
        name: attachment.name,
        type: attachment.type
    }
}

export async function convertMilestone(milestone: MilestoneEntity): Promise<MilestoneRead> {

    const openIssueCount = await Database.get().issueRepository.countBy({ milestone, state: "open", deleted: IsNull() })
    const closedIssueCount = await Database.get().issueRepository.countBy({ milestone, state: "closed", deleted: IsNull() })

    return {
        userId: milestone.userId,
        productId: milestone.productId,
        milestoneId: milestone.milestoneId,
        created: milestone.created,
        updated: milestone.updated,
        deleted: milestone.deleted,
        label: milestone.label,
        start: milestone.start,
        end: milestone.end,
        openIssueCount,
        closedIssueCount
    }
}

export async function convertMember(member: MemberEntity): Promise<MemberRead> {
    return {
        userId: member.userId,
        productId: member.productId,
        memberId: member.memberId,
        created: member.created,
        updated: member.updated,
        deleted: member.deleted,
        role: member.role
    }
}