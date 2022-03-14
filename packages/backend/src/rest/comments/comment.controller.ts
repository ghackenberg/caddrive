import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Comment, CommentAddData, CommentUpdateData, CommentREST } from 'productboard-common'
import { CommentService } from './comment.service'

@Controller('rest/comments')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class CommentController implements CommentREST {
    constructor(
        private readonly commentService: CommentService
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
        return this.commentService.addComment(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiResponse({ type: Comment })
    async getComment(
        @Param('id') id: string
    ): Promise<Comment> {
        return this.commentService.getComment(id)
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiBody({ type: CommentUpdateData, required: true })
    @ApiResponse({ type: Comment })
    async updateComment(
        @Param('id') id: string, @Body() data: CommentUpdateData
    ): Promise<Comment> {
        return this.commentService.updateComment(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Comment })
    async deleteComment(
        @Param('id') id: string 
    ): Promise<Comment> {
        return this.commentService.deleteComment(id)
    }
}