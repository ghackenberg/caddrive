import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { In } from 'typeorm'

import { getCommentOrFail, getIssueOrFail, getMemberOrFail, getMilestoneOrFail, getUserOrFail, getVersionOrFail } from 'productboard-database'

// USER

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canFindUserOrFail(userId: string, _query: string, _productId: string) {
    await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, ForbiddenException)
}
export async function canCreateUserOrFail(userId: string ) {
    await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, ForbiddenException)
}
export async function canReadUserOrFail(userId: string, otherUserId: string) {
    if(userId != otherUserId) {
        try { await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, Error)}
        catch(error) { await getMemberOrFail({ userId: userId, deleted: false, product: { members: { userId: otherUserId, deleted: false } } }, ForbiddenException) }
    }
}
export async function canUpdateUserOrFail(userId: string, otherUserId: string) {
    if(userId != otherUserId) { await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, ForbiddenException) }   
}
export async function canDeleteUserOrFail(userId: string, otherUserId: string) {
    if(userId != otherUserId) { await getUserOrFail({id: userId, deleted: false, userManagementPermission: true}, ForbiddenException) }   
}

// PRODUCT

export async function canCreateProductOrFail(userId: string) {
    await getUserOrFail({id: userId, deleted: false, productManagementPermission: true}, ForbiddenException)
}
export async function canReadProductOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateProductOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}
export async function canDeleteProductOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}

// MEMBER

export async function canFindMemberOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateMemberOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}
export async function canReadMemberOrFail(userId: string, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: member.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateMemberOrFail(userId: string, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: member.productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}
export async function canDeleteMemberOrFail(userId: string, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: member.productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}

// VERSION

export async function canFindVersionOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateVersionOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canReadVersionOrFail(userId: string, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: version.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateVersionOrFail(userId: string, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: version.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canDeleteVersionOrFail(userId: string, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: version.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}

// FILE

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canCreateFileOrFail(_userId: string, _fileId: string) {
    // empty
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canReadFileOrFail(_userId: string, _fileId: string) {
    // empty
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canUpdateFileOrFail(_userId: string, _fileId: string) {
    // empty
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canDeleteFileOrFail(_userId: string, _fileId: string) {
    // empty
}

// ISSUE

export async function canFindIssuenOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateIssueOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canReadIssueOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateIssueOrFail(userId: string, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canDeleteIssueOrFail(userId: string, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}

// COMMENT

export async function canFindCommentOrFail(userId: string, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateCommentOrFail(userId: string, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canReadCommentOrFail(userId: string, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateCommentOrFail(userId: string, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canDeleteCommentOrFail(userId: string, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}

// MILESTONE

export async function canFindMilestoneOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateMilestoneOrFail(userId: string, productId: string) {
    await getMemberOrFail({ userId: userId, product: { id: productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canReadMilestoneOrFail(userId: string, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: milestone.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateMilestoneOrFail(userId: string, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: milestone.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canDeleteMilestoneOrFail(userId: string, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: userId, product: { id: milestone.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}