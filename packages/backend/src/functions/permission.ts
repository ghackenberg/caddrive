import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { In } from 'typeorm'

import { User } from 'productboard-common'
import { getCommentOrFail, getIssueOrFail, getMemberOrFail, getMilestoneOrFail, getProductOrFail, getVersionOrFail } from 'productboard-database'

// USER

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canFindUserOrFail(_user: User & { permissions: string[] }, _query: string, _productId: string) {
    // empty
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canCreateUserOrFail(_user: User & { permissions: string[] } ) {
    throw new ForbiddenException()
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canReadUserOrFail(_user: User & { permissions: string[] }, _otherUserId: string) {
    // empty
}
export async function canUpdateUserOrFail(user: User & { permissions: string[] }, otherUserId: string) {
    if (!user || user.id != otherUserId) {
        throw new ForbiddenException()
    }   
}
export async function canDeleteUserOrFail(user: User & { permissions: string[] }, otherUserId: string) {
    if (!user || user.id != otherUserId) {
        throw new ForbiddenException()
    }   
}

// PRODUCT

export async function canCreateProductOrFail(user: User & { permissions: string[] }) {
    if (!user || !user.permissions.includes('create:products')) {
        throw new ForbiddenException()
    }
}
export async function canReadProductOrFail(user: User & { permissions: string[] }, productId: string) {
    try {
        await getProductOrFail({ id: productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateProductOrFail(user: User & { permissions: string[] }, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteProductOrFail(user: User & { permissions: string[] }, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// MEMBER

export async function canFindMemberOrFail(user: User & { permissions: string[] }, productId: string) {
    try {
        await getProductOrFail({ id: productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateMemberOrFail(user: User & { permissions: string[] }, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadMemberOrFail(user: User & { permissions: string[] }, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: null }, NotFoundException)
    try {
        await getProductOrFail({ id: member.productId, public: true, deleted: null}, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: member.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateMemberOrFail(user: User & { permissions: string[] }, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: member.productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteMemberOrFail(user: User & { permissions: string[] }, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: member.productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// VERSION

export async function canFindVersionOrFail(user: User & { permissions: string[] }, productId: string) {
    try {
        await getProductOrFail({ id: productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateVersionOrFail(user: User & { permissions: string[] }, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadVersionOrFail(user: User & { permissions: string[] }, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: null }, NotFoundException)
    try {
        await getProductOrFail({ id: version.productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: version.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateVersionOrFail(user: User & { permissions: string[] }, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: version.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteVersionOrFail(user: User & { permissions: string[] }, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: version.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
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

export async function canFindIssuenOrFail(user: User & { permissions: string[] }, productId: string) {
    try {
        await getProductOrFail({ id: productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateIssueOrFail(user: User & { permissions: string[] }, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadIssueOrFail(user: User & { permissions: string[] }, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
    try {
        await getProductOrFail({ id: issue.productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateIssueOrFail(user: User & { permissions: string[] }, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteIssueOrFail(user: User & { permissions: string[] }, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// COMMENT

export async function canFindCommentOrFail(user: User & { permissions: string[] }, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
    try {
        await getProductOrFail({ id: issue.productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateCommentOrFail(user: User & { permissions: string[] }, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadCommentOrFail(user: User & { permissions: string[] }, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: null }, NotFoundException)
    try {
        await getProductOrFail({ id: issue.productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateCommentOrFail(user: User & { permissions: string[] }, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteCommentOrFail(user: User & { permissions: string[] }, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// MILESTONE

export async function canFindMilestoneOrFail(user: User & { permissions: string[] }, productId: string) {
    try {
        await getProductOrFail({ id: productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateMilestoneOrFail(user: User & { permissions: string[] }, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadMilestoneOrFail(user: User & { permissions: string[] }, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: null }, NotFoundException)
    try {
        await getProductOrFail({ id: milestone.productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: milestone.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateMilestoneOrFail(user: User & { permissions: string[] }, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: milestone.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteMilestoneOrFail(user: User & { permissions: string[] }, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: milestone.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}