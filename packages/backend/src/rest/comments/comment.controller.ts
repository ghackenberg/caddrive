import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Comment, CommentAddData, CommentUpdateData, CommentREST, User } from 'productboard-common'
import { IssueRepository, MemberRepository } from 'productboard-database'
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
        const issue = await IssueRepository.findOneByOrFail({ id: issueId })
        try {
            await MemberRepository.findOneByOrFail({ productId: issue.productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.commentService.findComments(issueId)
    }

    @Post()
    @ApiBody({ type: CommentAddData, required: true })
    @ApiResponse({ type: Comment })
    async addComment(
        @Body() data: CommentAddData
    ): Promise<Comment> {
        const issue = await IssueRepository.findOneByOrFail({ id: data.issueId })
        try {
            await MemberRepository.findOneByOrFail({ productId: issue.productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.commentService.addComment(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiResponse({ type: Comment })
    async getComment(
        @Param('id') id: string
    ): Promise<Comment> {
        const comment = await this.commentService.getComment(id)
        const issue = await IssueRepository.findOneByOrFail({ id: comment.issueId })
        try {
            await MemberRepository.findOneByOrFail({ productId: issue.productId,  userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return comment
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiBody({ type: CommentUpdateData, required: true })
    @ApiResponse({ type: Comment })
    async updateComment(
        @Param('id') id: string, @Body() data: CommentUpdateData
    ): Promise<Comment> {
        const comment = await this.commentService.getComment(id)
        const issue = await IssueRepository.findOneByOrFail({ id: comment.issueId })
        try {
            await MemberRepository.findOneByOrFail({ productId: issue.productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.commentService.updateComment(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Comment })
    async deleteComment(
        @Param('id') id: string 
    ): Promise<Comment> {
        const comment = await this.commentService.getComment(id)
        const issue = await IssueRepository.findOneByOrFail({ id: comment.issueId })
        try {
            await MemberRepository.findOneByOrFail({ productId: issue.productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.commentService.deleteComment(id)
    }
}