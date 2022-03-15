import { Body, Controller, Delete, ForbiddenException, forwardRef, Get, Inject, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Comment, CommentAddData, CommentUpdateData, CommentREST, User } from 'productboard-common'
import { IssueService } from '../issues/issue.service'
import { MemberService } from '../members/member.service'
import { CommentService } from './comment.service'

@Controller('rest/comments')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class CommentController implements CommentREST {
    constructor(
        private readonly commentService: CommentService,
        @Inject(forwardRef(() => IssueService))
        private readonly issueService: IssueService,
        private readonly memberService: MemberService,
        @Inject(REQUEST)
        private readonly request: Express.Request
    ) {}

    @Get()
    @ApiQuery({ name: 'issue', type: 'string', required: true })
    @ApiResponse({ type: [Comment] })
    async findComments(
        @Query('issue') issueId: string
    ): Promise<Comment[]> {
        return this.commentService.findComments(issueId)
    }

    @Post()
    @ApiBody({ type: CommentAddData, required: true })
    @ApiResponse({ type: Comment })
    async addComment(
        @Body() data: CommentAddData
    ): Promise<Comment> {
        if (!data) {
            throw new NotFoundException()
        }
        const issue = await this.issueService.getIssue(data.issueId)
        if (!issue) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(issue.productId, (<User> this.request.user).id)).length == 0) {
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
        if (!comment) {
            throw new NotFoundException()
        }
        const issue = await this.issueService.getIssue(comment.issueId)
        if (!issue) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(issue.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return this.commentService.getComment(id)
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiBody({ type: CommentUpdateData, required: true })
    @ApiResponse({ type: Comment })
    async updateComment(
        @Param('id') id: string, @Body() data: CommentUpdateData
    ): Promise<Comment> {
        const comment = await this.commentService.getComment(id)
        if (!comment) {
            throw new NotFoundException()
        }
        const issue = await this.issueService.getIssue(comment.issueId)
        if (!issue) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(issue.productId, (<User> this.request.user).id)).length == 0) {
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
        if (!comment) {
            throw new NotFoundException()
        }
        const issue = await this.issueService.getIssue(comment.issueId)
        if (!issue) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(issue.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return this.commentService.deleteComment(id)
    }
}