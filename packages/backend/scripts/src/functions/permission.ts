import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { In } from 'typeorm'

import { User } from 'productboard-common'
import { 
    getCommentOrFail, 
    getIssueOrFail, 
    getMemberOrFail, 
    getMilestoneOrFail, 
    getProductOrFail, 
    getVersionOrFail,
    getTagOrFail,
    getTagAssignmentOrFail
} from 'productboard-database'

// USER

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canFindUserOrFail(_user: User, _query: string, _productId: string) {
    // empty
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canCreateUserOrFail(_user: User ) {
    throw new ForbiddenException()
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canReadUserOrFail(_user: User, _otherUserId: string) {
    // empty
}
export async function canUpdateUserOrFail(user: User, otherUserId: string) {
    if (!user || user.id != otherUserId) {
        throw new ForbiddenException()
    }   
}
export async function canDeleteUserOrFail(user: User, otherUserId: string) {
    if (!user || user.id != otherUserId) {
        throw new ForbiddenException()
    }   
}

// PRODUCT

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canCreateProductOrFail(_user: User) {
    // empty
}
export async function canReadProductOrFail(user: User, productId: string) {
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
export async function canUpdateProductOrFail(user: User, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteProductOrFail(user: User, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// MEMBER

export async function canFindMemberOrFail(user: User, productId: string) {
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
export async function canCreateMemberOrFail(user: User, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadMemberOrFail(user: User, memberId: string) {
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
export async function canUpdateMemberOrFail(user: User, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: member.productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteMemberOrFail(user: User, memberId: string) {
    const member = await getMemberOrFail({ id: memberId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: member.productId, deleted: null }, role: 'manager', deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// VERSION

export async function canFindVersionOrFail(user: User, productId: string) {
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
export async function canCreateVersionOrFail(user: User, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadVersionOrFail(user: User, versionId: string) {
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
export async function canUpdateVersionOrFail(user: User, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: version.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteVersionOrFail(user: User, versionId: string) {
    const version = await getVersionOrFail({ id: versionId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: version.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// FILE

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canCreateFileOrFail(_user: User, _fileId: string) {
    // empty
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canReadFileOrFail(_user: User, _fileId: string) {
    // empty
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canUpdateFileOrFail(_user: User, _fileId: string) {
    // empty
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canDeleteFileOrFail(_user: User, _fileId: string) {
    // empty
}

// ISSUE

export async function canFindIssuenOrFail(user: User, productId: string) {
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
export async function canCreateIssueOrFail(user: User, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadIssueOrFail(user: User, issueId: string) {
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
export async function canUpdateIssueOrFail(user: User, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteIssueOrFail(user: User, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// COMMENT

export async function canFindCommentOrFail(user: User, issueId: string) {
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
export async function canCreateCommentOrFail(user: User, issueId: string) {
    const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadCommentOrFail(user: User, commentId: string) {
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
export async function canUpdateCommentOrFail(user: User, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteCommentOrFail(user: User, commentId: string) {
    const comment = await getCommentOrFail({ id: commentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: comment.issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// MILESTONE

export async function canFindMilestoneOrFail(user: User, productId: string) {
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
export async function canCreateMilestoneOrFail(user: User, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadMilestoneOrFail(user: User, milestoneId: string) {
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
export async function canUpdateMilestoneOrFail(user: User, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: milestone.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteMilestoneOrFail(user: User, milestoneId: string) {
    const milestone = await getMilestoneOrFail({ id: milestoneId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: milestone.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// TAG

export async function canFindTagOrFail(user: User, productId: string) {
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
export async function canCreateTagOrFail(user: User, productId: string) {
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadTagOrFail(user: User, tagId: string) {
    const tag = await getTagOrFail({ id: tagId, deleted: null }, NotFoundException)
    try {
        await getProductOrFail({ id: tag.productId, public: true, deleted: null }, Error)
    } catch (error) {
        if (user) {
            await getMemberOrFail({ userId: user.id, product: { id: tag.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateTagOrFail(user: User, tagId: string) {
    const tag = await getTagOrFail({ id: tagId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: tag.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteTagOrFail(user: User, tagId: string) {
    const tag = await getTagOrFail({ id: tagId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: tag.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// TAGASSIGNMENT

export async function canFindTagAssignmentOrFail(user: User, issueId?: string, tagId?: string) {
    if (issueId && !tagId) {
        const issue = await getIssueOrFail({ id: issueId, deleted: null }, NotFoundException)
        try {
            await getProductOrFail({ id: issue.productId, public: true, deleted: null }, Error)
        } catch (error) {
            if (user) {
                await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
            } 
            else {
                throw new ForbiddenException()
            }
        }
    }
    if (!issueId && tagId) {
        const tag = await getTagOrFail({ id: tagId, deleted: null }, NotFoundException)
        try {
            await getProductOrFail({ id: tag.productId, public: true, deleted: null }, Error)
        } catch (error) {
            if (user) {
                await getMemberOrFail({ userId: user.id, product: { id: tag.productId, deleted: null }, role: In(['manager', 'engineer', 'customer']), deleted: null}, ForbiddenException)
            } 
            else {
                throw new ForbiddenException()
            }
        }
    }
    if (issueId && tagId) {
            throw new ForbiddenException()
        }
}
export async function canCreateTagAssignmentOrFail(user: User, tagAssignmentId: string) {
    const tagAssignment = await getTagAssignmentOrFail({ id: tagAssignmentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: tagAssignment.issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadTagAssignmentOrFail(user: User, tagAssignmentId: string) {
    const tagAssignment = await getTagAssignmentOrFail({ id: tagAssignmentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: tagAssignment.issueId, deleted: null }, NotFoundException)
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
export async function canUpdateTagAssignmentOrFail(user: User, tagAssignmentId: string) {
    const tagAssignment = await getTagAssignmentOrFail({ id: tagAssignmentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: tagAssignment.issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteTagAssignmentOrFail(user: User, tagAssignmentId: string) {
    const tagAssignment = await getTagAssignmentOrFail({ id: tagAssignmentId, deleted: null }, NotFoundException)
    const issue = await getIssueOrFail({ id: tagAssignment.issueId, deleted: null }, NotFoundException)
    if (user) {
        await getMemberOrFail({ userId: user.id, product: { id: issue.productId, deleted: null }, role: In(['manager', 'engineer']), deleted: null}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}