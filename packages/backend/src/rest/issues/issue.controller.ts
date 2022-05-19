import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { Issue, IssueAddData, IssueUpdateData, IssueREST, User } from 'productboard-common'
import { IssueService } from './issue.service'
import { canReadIssueOrFail, canReadProductOrFail, canWriteIssueOrFail, canWriteProductOrFail } from '../../permission'

@Controller('rest/issues')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class IssueController implements IssueREST {
    constructor(
        private readonly issueService: IssueService,
        @Inject(REQUEST)
        private readonly request: Request
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiQuery({ name: 'milestone', type: 'string', required: false })
    @ApiQuery({ name: 'state', type: 'string', required: false })
    @ApiResponse({ type: [Issue] })
    async findIssues(
        @Query('product') productId: string,
        @Query('milestone') milestoneId?: string,
        @Query('state') state?: 'open' | 'closed'
    ): Promise<Issue[]> {
        canReadProductOrFail((<User> this.request.user).id, productId)
        return this.issueService.findIssues(productId, milestoneId, state)
    }

    @Post()
    @ApiBody({ type: IssueAddData, required: true })
    @ApiResponse({ type: Issue })
    async addIssue(
        @Body() data: IssueAddData
    ): Promise<Issue> {
        canWriteProductOrFail((<User> this.request.user).id, data.productId)
        return this.issueService.addIssue(data)
    }  

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Issue })
    async getIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        canReadIssueOrFail((<User> this.request.user).id, id)
        return this.issueService.getIssue(id)
    } 

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Issue, required: true })
    @ApiResponse({ type: Issue })
    async updateIssue(
        @Param('id') id: string,
        @Body() data: IssueUpdateData
    ): Promise<Issue> {
        canWriteIssueOrFail((<User> this.request.user).id, id)
        return this.issueService.updateIssue(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Issue] })
    async deleteIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        canWriteIssueOrFail((<User> this.request.user).id, id)
        return this.issueService.deleteIssue(id)
    } 
}