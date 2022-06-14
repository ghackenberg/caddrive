import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { In } from 'typeorm'
import { getCommentOrFail, getIssueOrFail, getMemberOrFail, getMilestoneOrFail, getProductOrFail, getUserOrFail, getVersionOrFail, MemberRepository } from 'productboard-database'

// USER

export async function canFindUserOrFail(userId: string, _query: string, _productId: string) {
    await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, ForbiddenException)
}
export async function canCreateUserOrFail(userId: string ) {
    await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, ForbiddenException)
}
export async function canReadUserOrFail(userId: string, otherUserId: string) {
    if(userId != otherUserId) {
        try {
            await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, Error)
        } catch(error) {
            await getMemberOrFail({ userId: userId, deleted: false, product: { members: { userId: otherUserId, deleted: false } } }, ForbiddenException)
        }
    }
}
export async function canUpdateUserOrFail(userId: string, otherUserId: string) {
    if(userId != otherUserId) {
        await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, ForbiddenException)
    }   
}
export async function canDeleteUserOrFail(userId: string, otherUserId: string) {
    if(userId != otherUserId) {
        await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, ForbiddenException)
    }   
}

// PRODUCT

export async function canCreateProductOrFail(userId: string) {
    await getUserOrFail({id: userId, deleted: false, productManagementPermission: true}, ForbiddenException)
   
}
export async function canReadProductOrFail(userId: string, productId: string) {
    const product = await getProductOrFail({ id: productId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId, productId: product.id, deleted: false }, ForbiddenException)
}
export async function canUpdateProductOrFail(userId: string, productId: string) {
    const product = await getProductOrFail({ id: productId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId, productId: product.id, role: 'manager', deleted: false }, ForbiddenException)
}
export async function canDeleteProductOrFail(userId: string, productId: string) {
    const product = await getProductOrFail({ id: productId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId, productId: product.id, role: 'manager', deleted: false }, ForbiddenException)
}

// MEMBER

export async function canCreateMemberOrFail(userId: string, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await canUpdateProductOrFail(userId, member.productId)
}
export async function canReadMemberOrFail(userId: string, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, member.productId)
}
export async function canUpdateMemberOrFail(userId: string, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await canUpdateProductOrFail(userId, member.productId)
}
export async function canDeleteMemberOrFail(userId: string, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await canUpdateProductOrFail(userId, member.productId)
}


// VERSION

export async function canCreateVersionOrFail(userId: string, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, version.productId)
}
export async function canReadVersionOrFail(userId: string, versionId: string) {
    try {
        MemberRepository.findOneByOrFail({ userId, product: { versions: { id: versionId, deleted: false }, deleted: false }, deleted: false })
    } catch {
        throw new ForbiddenException()
    }
}
export async function canUpdateVersionOrFail(userId: string, versionId: string) {
    try {
        MemberRepository.findOneByOrFail({ userId, product: { versions: { id: versionId, deleted: false }, deleted: false }, role: In(['manager', 'engineer']), deleted: false })
    } catch {
        throw new ForbiddenException()
    }
}
export async function canDeleteVersionOrFail(userId: string, versionId: string) {
    try {
        MemberRepository.findOneByOrFail({ userId, product: { versions: { id: versionId, deleted: false }, deleted: false }, role: In(['manager', 'engineer']), deleted: false })
    } catch {
        throw new ForbiddenException()
    }
}

// FILE

export async function canCreateFileOrFail(_userId: string, _fileId: string) {

}
export async function canReadFileOrFail(_userId: string, _fileId: string) {

}
export async function canUpdateFileOrFail(_userId: string, _fileId: string) {

}
export async function canDeleteFileOrFail(_userId: string, _fileId: string) {

}

// ISSUE

export async function canCreateIssueOrFail(userId: string, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, issue.productId)
}
export async function canReadIssueOrFail(userId: string, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, issue.productId)
}
export async function canUpdateIssueOrFail(userId: string, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, issue.productId)
}
export async function canDeleteIssueOrFail(userId: string, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, issue.productId)
}

// COMMENT

export async function canCreateCommentOrFail(userId: string, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    await canReadIssueOrFail(userId, comment.issueId)
}
export async function canReadCommentOrFail(userId: string, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    await canReadIssueOrFail(userId, comment.issueId)
}
export async function canUpdateCommentOrFail(userId: string, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    await canReadIssueOrFail(userId, comment.issueId)
}
export async function canDeleteCommentOrFail(userId: string, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    await canReadIssueOrFail(userId, comment.issueId)
}

// MILESTONE

export async function canCreateMilestoneOrFail(userId: string, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, milestone.productId)
}
export async function canReadMilestoneOrFail(userId: string, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, milestone.productId)
}
export async function canUpdateMilestoneOrFail(userId: string, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, milestone.productId)
}
export async function canDeleteMilestoneOrFail(userId: string, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await canReadProductOrFail(userId, milestone.productId)
}