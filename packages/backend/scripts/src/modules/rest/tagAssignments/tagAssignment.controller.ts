import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

import { TagAssignment, TagAssignmentREST, TagAssignmentAddData, TagAssignmentUpdateData } from "productboard-common"

import { TokenOptionalGuard } from '../tokens/token.guard'
import {TagAssignmentService } from './tagAssignment.service'

@Controller('rest/tagassignments')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class TagAssignmentController implements TagAssignmentREST {
    constructor(
        private readonly tagAssignmentService: TagAssignmentService,
    ) {}

    @Get()
    @ApiQuery({ name: 'issue', type: 'string', required: true })
    @ApiResponse({ type: [TagAssignment] })
    async findTagAssignments(
        @Query('issue') issueId: string
    ): Promise<TagAssignment[]> {
        return await this.tagAssignmentService.findTagAssignments(issueId)
    }

    @Post()
    @ApiBody({ type: TagAssignmentAddData })
    @ApiResponse({ type: TagAssignment })
    async addTagAssignment(
        @Body() data: TagAssignment
    ): Promise<TagAssignment> {
        console.log(data)
        return await this.tagAssignmentService.addTagAssignment(data)
    }
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: TagAssignment })
    async getTagAssignment(
        @Param('id') id: string
    ): Promise<TagAssignment> {
        return this.tagAssignmentService.getTagAssignment(id)
    }
    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: TagAssignmentUpdateData })
    @ApiResponse({ type: TagAssignment })
    async updateTagAssignment(
        @Param('id') id: string,
        @Body() data: TagAssignmentUpdateData
    ): Promise<TagAssignment> {
        return this.tagAssignmentService.updateTagAssignment(id, data)
    }
    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: TagAssignment })
    async deleteTagAssignment(
        @Param('id') id: string
    ): Promise<TagAssignment> {
        return this.tagAssignmentService.deleteTagAssignment(id)
    } 

}