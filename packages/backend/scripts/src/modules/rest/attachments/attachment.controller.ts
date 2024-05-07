import { Body, Controller, Delete, Get, Inject, Param, Post, Put, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiResponse, getSchemaPath } from '@nestjs/swagger'

import { AttachmentCreate, AttachmentREST, AttachmentRead, AttachmentUpdate } from 'productboard-common'

import { AttachmentService } from './attachment.service'
import { canCreateAttachmentOrFail, canDeleteAttachmentOrFail, canFindAttachmentOrFail, canReadAttachmentOrFail, canUpdateAttachmentOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/attachments')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(AttachmentCreate, AttachmentUpdate)
export class AttachmentController implements AttachmentREST<string, string, Express.Multer.File> {
    constructor(
        private readonly service: AttachmentService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: [AttachmentRead] })
    async findAttachments(
        @Param('productId') productId: string
    ): Promise<AttachmentRead[]> {
        await canFindAttachmentOrFail(this.request.user, productId)
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
                data: { $ref: getSchemaPath(AttachmentCreate) },
                file: { type: 'string', format: 'binary' }
            },
            required: ['data', 'file']
        }
    })
    @ApiResponse({ type: AttachmentRead })
    async addAttachment(
        @Param('productId') productId: string,
        @Body('data') data: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<AttachmentRead> {
        await canCreateAttachmentOrFail(this.request.user, productId)
        return this.service.addAttachment(productId, JSON.parse(data), file)
    }

    @Get(':attachmentId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'attachmentId', type: 'string', required: true })
    @ApiResponse({ type: AttachmentRead })
    async getAttachment(
        @Param('productId') productId: string,
        @Param('attachmentId') attachmentId: string
    ): Promise<AttachmentRead> {
        await canReadAttachmentOrFail(this.request.user, productId, attachmentId)
        return this.service.getAttachment(productId, attachmentId)
    }

    @Get(':attachmentId/:name')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'attachmentId', type: 'string', required: true })
    @ApiResponse({ type: StreamableFile })
    async getAttachmentFile(
        @Param('productId') productId: string,
        @Param('attachmentId') attachmentId: string,
        @Param('name') name: string
    ): Promise<StreamableFile> {
        return this.service.getAttachmentFile(productId, attachmentId, name)
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
                data: { $ref: getSchemaPath(AttachmentUpdate) },
                file: { type: 'string', format: 'binary' }
            },
            required: ['data', 'file']
        }
    })
    @ApiResponse({ type: AttachmentRead })
    async updateAttachment(
        @Param('productId') productId: string,
        @Param('attachmentId') attachmentId: string,
        @Body('data') data: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<AttachmentRead> {
        await canUpdateAttachmentOrFail(this.request.user, productId, attachmentId)
        return this.service.updateAttachment(productId, attachmentId, JSON.parse(data), file)
    }

    @Delete(':attachmentId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'attachmentId', type: 'string', required: true })
    @ApiResponse({ type: AttachmentRead })
    async deleteAttachment(
        @Param('productId') productId: string,
        @Param('attachmentId') attachmentId: string
    ): Promise<AttachmentRead> {
        await canDeleteAttachmentOrFail(this.request.user, productId, attachmentId)
        return this.service.deleteAttachment(productId, attachmentId)
    }
}