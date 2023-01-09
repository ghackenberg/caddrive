import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { In } from 'typeorm'

import { User } from 'productboard-common'
import { getCommentOrFail, getIssueOrFail, getMemberOrFail, getMilestoneOrFail, getUserOrFail, getVersionOrFail } from 'productboard-database'

// USER

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canFindUserOrFail(user: User, _query: string, _productId: string) {
    await getUserOrFail({id: user.id, deleted: false, userManagementPermission: true}, ForbiddenException)
}
export async function canCreateUserOrFail(user: User ) {
    await getUserOrFail({id: user.id, deleted: false, userManagementPermission: true}, ForbiddenException)
}
export async function canReadUserOrFail(user: User, otherUserId: string) {
    if(user.id != otherUserId) {
        try { await getUserOrFail({id: user.id, deleted: false, userManagementPermission: true}, Error)}
        catch(error) { await getMemberOrFail({ userId: user.id, deleted: false, product: { members: { userId: otherUserId, deleted: false } } }, ForbiddenException) }
    }
}
export async function canUpdateUserOrFail(user: User, otherUserId: string) {
    if(user.id != otherUserId) { await getUserOrFail({id: user.id, deleted: false, userManagementPermission: true}, ForbiddenException) }   
}
export async function canDeleteUserOrFail(user: User, otherUserId: string) {
    if(user.id != otherUserId) { await getUserOrFail({id: user.id, deleted: false, userManagementPermission: true}, ForbiddenException) }   
}

// PRODUCT

export async function canCreateProductOrFail(user: User) {
    await getUserOrFail({id: user.id, deleted: false, productManagementPermission: true}, ForbiddenException)
}
export async function canReadProductOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateProductOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}
export async function canDeleteProductOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}

// MEMBER

export async function canFindMemberOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateMemberOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}
export async function canReadMemberOrFail(user: User, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: member.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateMemberOrFail(user: User, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: member.productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}
export async function canDeleteMemberOrFail(user: User, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: member.productId, deleted: false }, role: 'manager', deleted: false}, ForbiddenException)
}

// VERSION

export async function canFindVersionOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateVersionOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canReadVersionOrFail(user: User, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: version.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateVersionOrFail(user: User, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: version.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canDeleteVersionOrFail(user: User, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: version.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
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

export async function canFindIssuenOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateIssueOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canReadIssueOrFail(user: User, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateIssueOrFail(user: User, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canDeleteIssueOrFail(user: User, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}

// COMMENT

export async function canFindCommentOrFail(user: User, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateCommentOrFail(user: User, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canReadCommentOrFail(user: User, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateCommentOrFail(user: User, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canDeleteCommentOrFail(user: User, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: false }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}

// MILESTONE

export async function canFindMilestoneOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canCreateMilestoneOrFail(user: User, productId: string) {
    await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canReadMilestoneOrFail(user: User, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: milestone.productId, deleted: false }, role: In(['manager', 'engineer', 'customer']), deleted: false}, ForbiddenException)
}
export async function canUpdateMilestoneOrFail(user: User, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: milestone.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}
export async function canDeleteMilestoneOrFail(user: User, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: false }, NotFoundException)
    await getMemberOrFail({ userId: user.id, product: { id: milestone.productId, deleted: false }, role: In(['manager', 'engineer']), deleted: false}, ForbiddenException)
}