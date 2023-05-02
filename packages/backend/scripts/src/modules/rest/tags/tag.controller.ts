import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

import { Tag, TagREST, TagAddData, TagUpdateData } from "productboard-common"

import { TokenOptionalGuard } from '../tokens/token.guard'
import {TagService } from './tag.service'

@Controller('rest/tags')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class TagController implements TagREST {
    constructor(
        private readonly tagService: TagService,
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiResponse({ type: [Tag] })
    async findTags(
        @Query('product') productId: string
    ): Promise<Tag[]> {
        return await this.tagService.findTags(productId)
    }

    @Post()
    @ApiBody({ type: TagAddData })
    @ApiResponse({ type: Tag })
    async addTag(
        @Body() data: Tag
    ): Promise<Tag> {
        return await this.tagService.addTag(data)
    }
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Tag })
    async getTag(
        @Param('id') id: string
    ): Promise<Tag> {
        console.log('get tag')
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
        return this.tagService.updateTag(id, data)
    }
    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Tag })
    async deleteTag(
        @Param('id') id: string
    ): Promise<Tag> {
        return this.tagService.deleteTag(id)
    } 

}