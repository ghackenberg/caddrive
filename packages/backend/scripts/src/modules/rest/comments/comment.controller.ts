import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiResponse } from '@nestjs/swagger'

import 'multer'

import { CommentCreate, CommentREST, CommentRead, CommentUpdate } from 'productboard-common'

import { CommentService } from './comment.service'
import { canReadCommentOrFail, canUpdateCommentOrFail, canDeleteCommentOrFail, canCreateCommentOrFail, canFindCommentOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/issues/:issueId/comments')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(CommentCreate, CommentUpdate)
export class CommentController implements CommentREST {
    constructor(
        private readonly commentService: CommentService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiResponse({ type: [CommentRead] })
    async findComments(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string
    ): Promise<CommentRead[]> {
        await canFindCommentOrFail(this.request.user && this.request.user.userId, productId, issueId)
        return this.commentService.findComments(productId, issueId)
    }

    @Post()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiBody({ type: CommentCreate, required: true })
    @ApiResponse({ type: Comment })
    async addComment(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string,
        @Body() data: CommentCreate
    ): Promise<CommentRead> {
        await canCreateCommentOrFail(this.request.user && this.request.user.userId, productId, issueId)
        return this.commentService.addComment(productId, issueId, data)
    }

    @Get(':commentId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiParam({ name: 'commentId', type: 'string', required: true })
    @ApiResponse({ type: CommentRead })
    async getComment(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string,
        @Param('commentId') commentId: string
    ): Promise<CommentRead> {
        await canReadCommentOrFail(this.request.user && this.request.user.userId, productId, issueId, commentId)
        return this.commentService.getComment(productId, issueId, commentId)
    }

    @Put(':commentId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiParam({ name: 'commentId', type: 'string', required: true })
    @ApiBody({ type: CommentUpdate, required: true })
    @ApiResponse({ type: Comment })
    async updateComment(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string,
        @Param('commentId') commentId: string,
        @Body() data: CommentUpdate
    ): Promise<CommentRead> {
        await canUpdateCommentOrFail(this.request.user && this.request.user.userId, productId, issueId, commentId)
        return this.commentService.updateComment(productId, issueId, commentId, data)
    }

    @Delete(':commentId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiParam({ name: 'commentId', type: 'string', required: true })
    @ApiResponse({ type: CommentRead })
    async deleteComment(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string,
        @Param('commentId') commentId: string
    ): Promise<CommentRead> {
        await canDeleteCommentOrFail(this.request.user && this.request.user.userId, productId, issueId, commentId)
        return this.commentService.deleteComment(productId, issueId, commentId)
    }
}