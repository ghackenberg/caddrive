import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiExtraModels, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

import "multer"

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'

import { canReadIssueOrFail, canUpdateIssueOrFail, canDeleteIssueOrFail, canCreateIssueOrFail, canFindIssuesOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'
import { IssueService } from './issue.service'

@Controller('rest/issues')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(IssueAddData, IssueUpdateData)
export class IssueController implements IssueREST {
    constructor(
        private readonly issueService: IssueService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiQuery({ name: 'milestone', type: 'string', required: false })
    @ApiQuery({ name: 'state', type: 'string', required: false })
    @ApiQuery({ name: 'tags', type: 'string', required: false })
    @ApiResponse({ type: [Issue] })
    async findIssues(
        @Query('product') productId: string,
        @Query('milestone') milestoneId?: string,
        @Query('state') state?: 'open' | 'closed',
        @Query('tags') tags?: string[]
    ): Promise<Issue[]> {
        await canFindIssuesOrFail(this.request.user, productId)
        return this.issueService.findIssues(productId, milestoneId, state, tags)
    }

    @Post()
    @ApiResponse({ type: Issue })
    async addIssue(
        @Body() data: Issue,
    ): Promise<Issue> {
        await canCreateIssueOrFail(this.request.user, data.productId)
        return this.issueService.addIssue(data)
    }  

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Issue })
    async getIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        await canReadIssueOrFail(this.request.user, id)
        return this.issueService.getIssue(id)
    } 

    @Put(':id')
    @ApiResponse({ type: Issue })
    async updateIssue(
        @Param('id') id: string,
        @Body() data: Issue,
    ): Promise<Issue> {
        await canUpdateIssueOrFail(this.request.user, id)
        return this.issueService.updateIssue(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Issue] })
    async deleteIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        await canDeleteIssueOrFail(this.request.user, id)
        return this.issueService.deleteIssue(id)
    } 
}