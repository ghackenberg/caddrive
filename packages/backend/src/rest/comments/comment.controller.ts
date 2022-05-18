import { Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Comment, CommentAddData, CommentUpdateData, CommentREST, User } from 'productboard-common'
import { getCommentOrFail, getIssueOrFail, getMemberOrFail, getProductOrFail, getUserOrFail } from 'productboard-database'
import { CommentService } from './comment.service'

@Controller('rest/comments')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class CommentController implements CommentREST {
    constructor(
        private readonly commentService: CommentService,
        @Inject(REQUEST)
        private readonly request: Express.Request
    ) {}

    @Get()
    @ApiQuery({ name: 'issue', type: 'string', required: true })
    @ApiResponse({ type: [Comment] })
    async findComments(
        @Query('issue') issueId: string
    ): Promise<Comment[]> {
        const issue = await getIssueOrFail({ id: issueId, deleted: false }, NotFoundException)
        const product = await getProductOrFail({ id: issue.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id,  userId: user.id, deleted: false }, ForbiddenException)
        return this.commentService.findComments(issueId)
    }

    @Post()
    @ApiBody({ type: CommentAddData, required: true })
    @ApiResponse({ type: Comment })
    async addComment(
        @Body() data: CommentAddData
    ): Promise<Comment> {
        const issue = await getIssueOrFail({ id: data.issueId, deleted: false }, NotFoundException)
        const product = await getProductOrFail({ id: issue.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id,  userId: user.id, deleted: false }, ForbiddenException)
        return this.commentService.addComment(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiResponse({ type: Comment })
    async getComment(
        @Param('id') id: string
    ): Promise<Comment> {
        const comment = await getCommentOrFail({ id, deleted: false }, NotFoundException)
        const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
        const product = await getProductOrFail({ id: issue.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id,  userId: user.id, deleted: false }, ForbiddenException)
        return this.commentService.getComment(id)
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiBody({ type: CommentUpdateData, required: true })
    @ApiResponse({ type: Comment })
    async updateComment(
        @Param('id') id: string, @Body() data: CommentUpdateData
    ): Promise<Comment> {
        const comment = await getCommentOrFail({ id, deleted: false }, NotFoundException)
        const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
        const product = await getProductOrFail({ id: issue.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id,  userId: user.id, deleted: false }, ForbiddenException)
        return this.commentService.updateComment(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Comment })
    async deleteComment(
        @Param('id') id: string 
    ): Promise<Comment> {
        const comment = await getCommentOrFail({ id, deleted: false }, NotFoundException)
        const issue = await getIssueOrFail({ id: comment.issueId, deleted: false }, NotFoundException)
        const product = await getProductOrFail({ id: issue.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id,  userId: user.id, deleted: false }, ForbiddenException)
        return this.commentService.deleteComment(id)
    }
}