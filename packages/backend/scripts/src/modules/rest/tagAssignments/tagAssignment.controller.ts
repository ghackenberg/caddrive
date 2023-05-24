import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

import { TagAssignment, TagAssignmentREST, TagAssignmentAddData, TagAssignmentUpdateData } from "productboard-common"

import { canReadTagAssignmentOrFail, canDeleteTagAssignmentOrFail, canUpdateTagAssignmentOrFail, canCreateTagAssignmentOrFail, canFindTagAssignmentOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'
import {TagAssignmentService } from './tagAssignment.service'

@Controller('rest/tagassignments')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class TagAssignmentController implements TagAssignmentREST {
    constructor(
        private readonly tagAssignmentService: TagAssignmentService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiQuery({ name: 'issue', type: 'string', required: false })
    @ApiQuery({ name: 'tag', type: 'string', required: false })
    @ApiResponse({ type: [TagAssignment] })
    async findTagAssignments(
        @Query('issue') issueId: string,
        @Query('tag') tagId: string
    ): Promise<TagAssignment[]> {
        await canFindTagAssignmentOrFail(this.request.user, issueId, tagId)
        return await this.tagAssignmentService.findTagAssignments(issueId, tagId)
    }

    @Post()
    @ApiBody({ type: TagAssignmentAddData })
    @ApiResponse({ type: TagAssignment })
    async addTagAssignment(
        @Body() data: TagAssignment
    ): Promise<TagAssignment> {
        console.log('call')
        await canCreateTagAssignmentOrFail(this.request.user, data.issueId)
        console.log('permission')

        return await this.tagAssignmentService.addTagAssignment(data)
    }
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: TagAssignment })
    async getTagAssignment(
        @Param('id') id: string
    ): Promise<TagAssignment> {
        await canReadTagAssignmentOrFail(this.request.user, id)
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
        await canUpdateTagAssignmentOrFail(this.request.user, id)
        return this.tagAssignmentService.updateTagAssignment(id, data)
    }
    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: TagAssignment })
    async deleteTagAssignment(
        @Param('id') id: string
    ): Promise<TagAssignment> {
        await canDeleteTagAssignmentOrFail(this.request.user, id)
        return this.tagAssignmentService.deleteTagAssignment(id)
    } 

}