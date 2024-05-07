/* eslint-disable @typescript-eslint/no-unused-vars */

import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { In, IsNull } from 'typeorm'

import { UserRead } from 'productboard-common'
import { getAttachmentOrFail, getCommentOrFail, getIssueOrFail, getMemberOrFail, getMilestoneOrFail, getProductOrFail, getVersionOrFail } from 'productboard-database'

// USER

export async function canFindUserOrFail(_user: UserRead, _productId: string, _query: string) {
    // empty
}
export async function canCreateUserOrFail(_user: UserRead) {
    throw new ForbiddenException()
}
export async function canReadUserOrFail(_user: UserRead, _otherUserId: string) {
    // empty
}
export async function canUpdateUserOrFail(user: UserRead, otherUserId: string) {
    if (!user || (!user.admin && user.userId != otherUserId)) {
        throw new ForbiddenException()
    }   
}
export async function canDeleteUserOrFail(user: UserRead, otherUserId: string) {
    if (!user || (!user.admin && user.userId != otherUserId)) {
        throw new ForbiddenException()
    }   
}

// PRODUCT

export async function canCreateProductOrFail(_user: UserRead) {
    // empty
}
export async function canReadProductOrFail(user: UserRead, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateProductOrFail(user: UserRead, productId: string) {
    await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: 'manager', deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteProductOrFail(user: UserRead, productId: string) {
    await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: 'manager', deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}

// MEMBER

export async function canFindMemberOrFail(user: UserRead, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
        }
    } else if (!product.public) {
        throw new ForbiddenException()
    }
}
export async function canCreateMemberOrFail(user: UserRead, productId: string) {
    await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: 'manager', deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadMemberOrFail(user: UserRead, productId: string, memberId: string) {
    await getMemberOrFail({ productId, memberId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateMemberOrFail(user: UserRead, productId: string, memberId: string) {
    await getMemberOrFail({ productId, memberId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: 'manager', deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteMemberOrFail(user: UserRead, productId: string, memberId: string) {
    await getMemberOrFail({ productId, memberId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: 'manager', deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}

// VERSION

export async function canFindVersionOrFail(user: UserRead, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
        }
    } else if (!product.public) {
        throw new ForbiddenException()
    }
}
export async function canCreateVersionOrFail(user: UserRead, productId: string) {
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadVersionOrFail(user: UserRead, productId: string, versionId: string) {
    await getVersionOrFail({ productId, versionId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateVersionOrFail(user: UserRead, productId: string, versionId: string) {
    await getVersionOrFail({ productId, versionId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteVersionOrFail(user: UserRead, productId: string, versionId: string) {
    await getVersionOrFail({ productId, versionId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}

// FILE

export async function canCreateFileOrFail(_user: UserRead, _fileId: string) {
    // empty
}
export async function canReadFileOrFail(_user: UserRead, _fileId: string) {
    // empty
}
export async function canUpdateFileOrFail(_user: UserRead, _fileId: string) {
    // empty
}
export async function canDeleteFileOrFail(_user: UserRead, _fileId: string) {
    // empty
}

// ISSUE

export async function canFindIssuenOrFail(user: UserRead, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
        }
    } else if (!product.public) {
        throw new ForbiddenException()
    }
}
export async function canCreateIssueOrFail(user: UserRead, productId: string) {
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadIssueOrFail(user: UserRead, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateIssueOrFail(user: UserRead, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteIssueOrFail(user: UserRead, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}

// COMMENT

export async function canFindCommentOrFail(user: UserRead, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateCommentOrFail(user: UserRead, productId: string, issueId: string) {
    await getIssueOrFail({ productId, issueId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadCommentOrFail(user: UserRead, productId: string, issueId: string, commentId: string) {
    await getCommentOrFail({ productId, issueId, commentId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateCommentOrFail(user: UserRead, productId: string, issueId: string, commentId: string) {
    const comment = await getCommentOrFail({ productId, issueId, commentId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            if (user.userId == comment.userId) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
            } else {
                throw new ForbiddenException()
            }
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteCommentOrFail(user: UserRead, productId: string, issueId: string, commentId: string) {
    await getCommentOrFail({ productId, issueId, commentId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}

// ATTACHMENT

export async function canFindAttachmentOrFail(user: UserRead, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
        }
    } else if (!product.public) {
        throw new ForbiddenException()
    }
}
export async function canCreateAttachmentOrFail(user: UserRead, productId: string) {
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadAttachmentOrFail(user: UserRead, productId: string, attachmentId: string) {
    await getAttachmentOrFail({ productId, attachmentId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateAttachmentOrFail(user: UserRead, productId: string, attachmentId: string) {
    await getAttachmentOrFail({ productId, attachmentId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteAttachmentOrFail(user: UserRead, productId: string, attachmentId: string) {
    await getAttachmentOrFail({ productId, attachmentId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}

// MILESTONE

export async function canFindMilestoneOrFail(user: UserRead, productId: string) {
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canCreateMilestoneOrFail(user: UserRead, productId: string) {
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canReadMilestoneOrFail(user: UserRead, productId: string, milestoneId: string) {
    await getMilestoneOrFail({ productId, milestoneId, deleted: IsNull() }, NotFoundException)
    const product = await getProductOrFail({ productId, deleted: IsNull() }, NotFoundException)
    if (!product.public) {
        if (user) {
            if (!user.admin) {
                await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer', 'customer']), deleted: IsNull() }, ForbiddenException)
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
export async function canUpdateMilestoneOrFail(user: UserRead, productId: string, milestoneId: string) {
    await getMilestoneOrFail({ productId, milestoneId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}
export async function canDeleteMilestoneOrFail(user: UserRead, productId: string, milestoneId: string) {
    await getMilestoneOrFail({ productId, milestoneId, deleted: IsNull() }, NotFoundException)
    if (user) {
        if (!user.admin) {
            await getMemberOrFail({ userId: user.userId, productId, role: In(['manager', 'engineer']), deleted: IsNull() }, ForbiddenException)
        }
    } else {
        throw new ForbiddenException()
    }
}