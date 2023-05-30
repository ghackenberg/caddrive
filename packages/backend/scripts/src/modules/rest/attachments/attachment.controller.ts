import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

import { Attachment, AttachmentREST, AttachmentAddData, AttachmentUpdateData } from "productboard-common"

import { canReadAttachmentOrFail, canDeleteAttachmentOrFail, canUpdateAttachmentOrFail, canCreateAttachmentOrFail, canFindAttachmentOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'
import { AttachmentService } from './attachment.service'

@Controller('rest/attachments')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class AttachmentController implements AttachmentREST {
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
        @Query('comment') commentId: string,
        @Query('issue') issueId: string
    ): Promise<Attachment[]> {
        await canFindAttachmentOrFail(this.request.user, commentId, issueId)
        return await this.attachmentService.findAttachments(commentId, issueId)
    }

    @Post()
    @ApiBody({ type: AttachmentAddData })
    @ApiResponse({ type: Attachment })
    async addAttachment(
        @Body() data: Attachment
    ): Promise<Attachment> {
        await canCreateAttachmentOrFail(this.request.user, data.commentId)
        return await this.attachmentService.addAttachment(data)
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
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: AttachmentUpdateData })
    @ApiResponse({ type: Attachment })
    async updateAttachment(
        @Param('id') id: string,
        @Body() data: AttachmentUpdateData
    ): Promise<Attachment> {
        await canUpdateAttachmentOrFail(this.request.user, id)
        return this.attachmentService.updateAttachment(id, data)
    }
    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Attachment })
    async deleteAttachment(
        @Param('id') id: string
    ): Promise<Attachment> {
        await canDeleteAttachmentOrFail(this.request.user, id)
        return this.attachmentService.deleteAttachment(id)
    } 
}