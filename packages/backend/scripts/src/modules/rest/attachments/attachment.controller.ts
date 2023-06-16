import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger'

import "multer"

import { Attachment, AttachmentAddData, AttachmentUpdateData, AttachmentREST } from 'productboard-common'

import { canReadAttachmentOrFail, canUpdateAttachmentOrFail, canDeleteAttachmentOrFail, canCreateAttachmentOrFail, canFindAttachmentOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'
import { AttachmentService } from './attachment.service'

@Controller('rest/attachments')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(AttachmentAddData, AttachmentUpdateData)
export class AttachmentController implements AttachmentREST<string, string, Express.Multer.File[], Express.Multer.File[], Express.Multer.File[]> {
    constructor(
        private readonly attachmentService: AttachmentService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiQuery({ name: 'comment', type: 'string', required: false })
    @ApiQuery({ name: 'issue', type: 'string', required: false })
    @ApiResponse({ type: [Attachment] })
    async findAttachments(
        @Query('comment') commentId?: string,
        @Query('issue') issueId?: string,
    ): Promise<Attachment[]> {
        await canFindAttachmentOrFail(this.request.user, commentId, issueId)
        return this.attachmentService.findAttachments(commentId, issueId)
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [   
                { name: 'audio', maxCount: 1 },
                { name: 'image', maxCount: 1 },
                { name: 'pdf', maxCount: 1 }
            ]
        )
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(AttachmentAddData) },
                audio: { type: 'string', format: 'binary' },
                image: { type: 'string', format: 'binary' },
                pdf: { type: 'string', format: 'binary' }
            },
            required: ['data']
        },
        required: true
    })
    @ApiResponse({ type: Attachment })
    async addAttachment(
        @Body('data') data: string,
        @UploadedFiles() files: { audio?: Express.Multer.File[], image?: Express.Multer.File[], pdf?: Express.Multer.File[]}
    ): Promise<Attachment> {
        console.log('_____________________________')
        console.log('controller ' + files.pdf)
        const parsedData = JSON.parse(data) as AttachmentAddData
        await canCreateAttachmentOrFail(this.request.user, parsedData.commentId)
        return this.attachmentService.addAttachment(parsedData, files)
    }  

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Attachment })
    async getAttachment(
        @Param('id') id: string
    ): Promise<Attachment> {
        await canReadAttachmentOrFail(this.request.user, id)
        return this.attachmentService.getAttachment(id)
    } 

    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'audio', maxCount: 1 },
                { name: 'image', maxCount: 1 },
                { name: 'pdf', maxCount: 1 }
            ]
        )
    )
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(AttachmentUpdateData) },
                audio: { type: 'string', format: 'binary' },
                image: { type: 'string', format: 'binary' },
                pdf: { type: 'string', format: 'binary' }
            },
            required: ['data']
        },
        required: true
    })
    @ApiResponse({ type: Attachment })
    async updateAttachment(
        @Param('id') id: string,
        @Body('data') data: string,
        @UploadedFiles() files?: { audio?: Express.Multer.File[], image?: Express.Multer.File[], pdf?: Express.Multer.File[] }
    ): Promise<Attachment> {
        const parsedData = JSON.parse(data) as AttachmentUpdateData
        await canUpdateAttachmentOrFail(this.request.user, id)
        return this.attachmentService.updateAttachment(id, parsedData, files)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Attachment] })
    async deleteAttachment(
        @Param('id') id: string
    ): Promise<Attachment> {
        await canDeleteAttachmentOrFail(this.request.user, id)
        return this.attachmentService.deleteAttachment(id)
    } 
}