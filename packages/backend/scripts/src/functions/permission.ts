/* eslint-disable @typescript-eslint/no-unused-vars */

import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { In, IsNull } from 'typeorm'

import { getCommentOrFail, getIssueOrFail, getMemberOrFail, getMilestoneOrFail, getProductOrFail, getVersionOrFail } from 'productboard-database'

// USER

export async function canFindUserOrFail(_userId: string, _productId: string, _query: string) {
    // empty
}
export async function canCreateUserOrFail(_userId: string) {
    throw new ForbiddenException()
}
export async function canReadUserOrFail(_userId: string, _otherUserId: string) {
    // empty
}
export async function canUpdateUserOrFail(userId: string, otherUserId: string) {
    if (userId != otherUserId) {
        throw new ForbiddenException()
    }   
}
export async function canDeleteUserOrFail(userId: string, otherUserId: string) {
    if (userId != otherUserId) {
        throw new ForbiddenException()
    }   
}

// PRODUCT

export async function canCreateProductOrFail(_userId: string) {
    // empty
}
export async function canReadProductOrFail(userId: string, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (userId) {
            await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateProductOrFail(userId: string, productId: string) {
    await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: 'manager', deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteProductOrFail(userId: string, productId: string) {
    await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: 'manager', deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// MEMBER

export async function canFindMemberOrFail(userId: string, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
    } else if (!product.public) {
        throw new ForbiddenException()
    }
}
export async function canCreateMemberOrFail(userId: string, productId: string) {
    await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: 'manager', deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadMemberOrFail(userId: string, productId: string, memberId: string) {
    await getMemberOrFail({ productId, memberId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (userId) {
            await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateMemberOrFail(userId: string, productId: string, memberId: string) {
    await getMemberOrFail({ productId, memberId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: 'manager', deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteMemberOrFail(userId: string, productId: string, memberId: string) {
    await getMemberOrFail({ productId, memberId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId: userId, role: 'manager', deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// VERSION

export async function canFindVersionOrFail(userId: string, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
    } else if (!product.public) {
        throw new ForbiddenException()
    }
}
export async function canCreateVersionOrFail(userId: string, productId: string) {
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadVersionOrFail(userId: string, productId: string, versionId: string) {
    await getVersionOrFail({ productId, versionId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (userId) {
            await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateVersionOrFail(userId: string, productId: string, versionId: string) {
    await getVersionOrFail({ productId, versionId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteVersionOrFail(userId: string, productId: string, versionId: string) {
    await getVersionOrFail({ productId, versionId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// FILE

export async function canCreateFileOrFail(_userId: string, _fileId: string) {
    // empty
}
export async function canReadFileOrFail(_userId: string, _fileId: string) {
    // empty
}
export async function canUpdateFileOrFail(_userId: string, _fileId: string) {
    // empty
}
export async function canDeleteFileOrFail(_userId: string, _fileId: string) {
    // empty
}

// ISSUE

export async function canFindIssuenOrFail(userId: string, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
    } else if (!product.public) {
        throw new ForbiddenException()
    }
}
export async function canCreateIssueOrFail(userId: string, productId: string) {
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadIssueOrFail(userId: string, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (userId) {
            await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateIssueOrFail(userId: string, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteIssueOrFail(userId: string, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// COMMENT

export async function canFindCommentOrFail(userId: string, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (userId) {
            await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateCommentOrFail(userId: string, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadCommentOrFail(userId: string, productId: string, issueId: string, commentId: string) {
    await getCommentOrFail({ productId, issueId, commentId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (userId) {
            await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateCommentOrFail(userId: string, productId: string, issueId: string, commentId: string) {
    await getCommentOrFail({ userId, productId, issueId, commentId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteCommentOrFail(userId: string, productId: string, issueId: string, commentId: string) {
    await getCommentOrFail({ productId, issueId, commentId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}

// MILESTONE

export async function canFindMilestoneOrFail(userId: string, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (userId) {
            await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateMilestoneOrFail(userId: string, productId: string) {
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadMilestoneOrFail(userId: string, productId: string, milestoneId: string) {
    await getMilestoneOrFail({ productId, milestoneId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (userId) {
            await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull()}, ForbiddenException)
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateMilestoneOrFail(userId: string, productId: string, milestoneId: string) {
    await getMilestoneOrFail({ productId, milestoneId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteMilestoneOrFail(userId: string, productId: string, milestoneId: string) {
    await getMilestoneOrFail({ productId, milestoneId, deleted: IsNull() }, NotFoundException)
    if (userId) {
        await getMemberOrFail({ productId, userId, role: In(['manager', 'engineer']), deleted: IsNull()}, ForbiddenException)
    } else {
        throw new ForbiddenException()
    }
}