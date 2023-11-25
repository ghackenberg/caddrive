import { Body, Controller, Delete, Get, Inject, Param, Post, Put, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiResponse, getSchemaPath } from '@nestjs/swagger'

import { Attachment, AttachmentAddData, AttachmentREST, AttachmentUpdateData } from 'productboard-common'

import { AttachmentService } from './attachment.service'
import { canCreateAttachmentOrFail, canDeleteAttachmentOrFail, canFindAttachmentOrFail, canReadAttachmentOrFail, canUpdateAttachmentOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/attachments')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(AttachmentAddData, AttachmentUpdateData)
export class AttachmentController implements AttachmentREST<string, string, Express.Multer.File> {
    constructor(
        private readonly service: AttachmentService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: [Attachment] })
    async findAttachments(
        @Param('productId') productId: string
    ): Promise<Attachment[]> {
        await canFindAttachmentOrFail(this.request.user.userId, productId)
        return this.service.findAttachments(productId)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiParam({ name: 'productId', type: 'string', required: true})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(AttachmentAddData) },
                file: { type: 'string', format: 'binary' }
            },
            required: ['data', 'file']
        }
    })
    @ApiResponse({ type: Attachment })
    async addAttachment(
        @Param('productId') productId: string,
        @Body('data') data: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Attachment> {
        await canCreateAttachmentOrFail(this.request.user.userId, productId)
        return this.addAttachment(productId, JSON.parse(data), file)
    }

    @Get(':attachmentId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'attachmentId', type: 'string', required: true })
    @ApiResponse({ type: Attachment })
    async getAttachment(
        @Param('productId') productId: string,
        @Param('attachmentId') attachmentId: string
    ): Promise<Attachment> {
        await canReadAttachmentOrFail(this.request.user.userId, productId, attachmentId)
        return this.service.getAttachment(productId, attachmentId)
    }

    @Get(':attachmentId/file')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'attachmentId', type: 'string', required: true })
    @ApiResponse({ type: StreamableFile })
    async getAttachmentFile(
        @Param('productId') productId: string,
        @Param('attachmentId') attachmentId: string
    ): Promise<StreamableFile> {
        await canReadAttachmentOrFail(this.request.user.userId, productId, attachmentId)
        const attachment = await this.service.getAttachment(productId, attachmentId)
        return new StreamableFile(await this.service.getAttachmentFile(productId, attachmentId), {
            type: attachment.type
        })
    }

    @Put(':attachmentId')
    @UseInterceptors(FileInterceptor('file'))
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'attachmentId', type: 'string', required: true })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(AttachmentAddData) },
                file: { type: 'string', format: 'binary' }
            },
            required: ['data', 'file']
        }
    })
    @ApiResponse({ type: Attachment })
    async updateAttachment(
        @Param('productId') productId: string,
        @Param('attachmentId') attachmentId: string,
        @Body('data') data: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Attachment> {
        await canUpdateAttachmentOrFail(this.request.user.userId, productId, attachmentId)
        return this.service.updateAttachment(productId, attachmentId, JSON.parse(data), file)
    }

    @Delete(':attachmentId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'attachmentId', type: 'string', required: true })
    @ApiResponse({ type: Attachment })
    async deleteAttachment(
        @Param('productId') productId: string,
        @Param('attachmentId') attachmentId: string
    ): Promise<Attachment> {
        await canDeleteAttachmentOrFail(this.request.user.userId, productId, attachmentId)
        return this.service.deleteAttachment(productId, attachmentId)
    }
}