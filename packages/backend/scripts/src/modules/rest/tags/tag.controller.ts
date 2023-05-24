import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

import { Tag, TagREST, TagAddData, TagUpdateData } from "productboard-common"

import { canReadTagOrFail, canDeleteTagOrFail, canUpdateTagOrFail, canCreateTagOrFail, canFindTagOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'
import { TagService } from './tag.service'

@Controller('rest/tags')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class TagController implements TagREST {
    constructor(
        private readonly tagService: TagService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiResponse({ type: [Tag] })
    async findTags(
        @Query('product') productId: string
    ): Promise<Tag[]> {
        await canFindTagOrFail(this.request.user, productId)
        return await this.tagService.findTags(productId)
    }

    @Post()
    @ApiBody({ type: TagAddData })
    @ApiResponse({ type: Tag })
    async addTag(
        @Body() data: Tag
    ): Promise<Tag> {
        await canCreateTagOrFail(this.request.user, data.productId)
        return await this.tagService.addTag(data)
    }
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Tag })
    async getTag(
        @Param('id') id: string
    ): Promise<Tag> {
        await canReadTagOrFail(this.request.user, id)
        return this.tagService.getTag(id)
    }
    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: TagUpdateData })
    @ApiResponse({ type: Tag })
    async updateTag(
        @Param('id') id: string,
        @Body() data: TagUpdateData
    ): Promise<Tag> {
        await canUpdateTagOrFail(this.request.user, id)
        return this.tagService.updateTag(id, data)
    }
    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Tag })
    async deleteTag(
        @Param('id') id: string
    ): Promise<Tag> {
        await canDeleteTagOrFail(this.request.user, id)
        return this.tagService.deleteTag(id)
    } 

}