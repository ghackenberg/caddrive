import { Request } from 'express'
import 'multer'
import { REQUEST } from '@nestjs/core'
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { Comment, CommentAddData, CommentUpdateData, CommentREST, User } from 'productboard-common'
import { CommentService } from './comment.service'
import { canReadCommentOrFail, canUpdateCommentOrFail, canDeleteCommentOrFail, canCreateCommentOrFail, canFindCommentOrFail } from '../../../functions/permission'

@Controller('rest/comments')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
@ApiExtraModels(CommentAddData, CommentUpdateData)
export class CommentController implements CommentREST<string, string, Express.Multer.File[]> {
    constructor(
        private readonly commentService: CommentService,
        @Inject(REQUEST)
        private readonly request: Request
    ) {}

    @Get()
    @ApiQuery({ name: 'issue', type: 'string', required: true })
    @ApiResponse({ type: [Comment] })
    async findComments(
        @Query('issue') issueId: string
    ): Promise<Comment[]> {
        await canFindCommentOrFail((<User> this.request.user).id, issueId)
        return this.commentService.findComments(issueId)
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'audio', maxCount: 1 }
        ])
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(CommentAddData) },
                audio: { type: 'string', format: 'binary' }
            },
            required: ['data']
        },
        required: true
    })
    @ApiResponse({ type: Comment })
    async addComment(
        @Body('data') data: string,
        @UploadedFiles() files: { audio?: Express.Multer.File[] }
    ): Promise<Comment> {
        const parsedData = JSON.parse(data) as CommentAddData
        await canCreateCommentOrFail((<User> this.request.user).id, parsedData.issueId)
        return this.commentService.addComment(parsedData, files)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiResponse({ type: Comment })
    async getComment(
        @Param('id') id: string
    ): Promise<Comment> {
        await canReadCommentOrFail((<User> this.request.user).id, id)
        return this.commentService.getComment(id)
    }

    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'audio', maxCount: 1 }
        ])
    )
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(CommentUpdateData) },
                audio: { type: 'string', format: 'binary' }
            },
            required: ['data']
        },
        required: true
    })
    @ApiResponse({ type: Comment })
    async updateComment(
        @Param('id') id: string,
        @Body('data') data: string,
        @UploadedFiles() files?: { audio?: Express.Multer.File[] }
    ): Promise<Comment> {
        const parsedData = JSON.parse(data) as CommentUpdateData
        await canUpdateCommentOrFail((<User> this.request.user).id, id)
        return this.commentService.updateComment(id, parsedData, files)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Comment })
    async deleteComment(
        @Param('id') id: string 
    ): Promise<Comment> {
        await canDeleteCommentOrFail((<User> this.request.user).id, id)
        return this.commentService.deleteComment(id)
    }
}