import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiResponse } from '@nestjs/swagger'

import "multer"

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'

import { IssueService } from './issue.service'
import { canReadIssueOrFail, canUpdateIssueOrFail, canDeleteIssueOrFail, canCreateIssueOrFail, canReadProductOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/issues')
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
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: [Issue] })
    async findIssues(
        @Param('productId') productId: string
    ): Promise<Issue[]> {
        await canReadProductOrFail(this.request.user && this.request.user.userId, productId)
        return this.issueService.findIssues(productId)
    }

    @Post()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiBody({ type: IssueAddData,  required: true })
    @ApiResponse({ type: Issue })
    async addIssue(
        @Param('productId') productId: string,
        @Body() data: IssueAddData
    ): Promise<Issue> {
        await canCreateIssueOrFail(this.request.user && this.request.user.userId, productId)
        return this.issueService.addIssue(productId, data)
    }  

    @Get(':issueId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiResponse({ type: Issue })
    async getIssue(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string
    ): Promise<Issue> {
        await canReadIssueOrFail(this.request.user && this.request.user.userId, productId, issueId)
        return this.issueService.getIssue(productId, issueId)
    } 

    @Put(':issueId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiBody({ type: IssueUpdateData, required: true })
    @ApiResponse({ type: Issue })
    async updateIssue(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string,
        @Body() data: IssueUpdateData
    ): Promise<Issue> {
        await canUpdateIssueOrFail(this.request.user && this.request.user.userId, productId, issueId)
        return this.issueService.updateIssue(productId, issueId, data)
    }

    @Delete(':issueId')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Issue] })
    async deleteIssue(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string
    ): Promise<Issue> {
        await canDeleteIssueOrFail(this.request.user && this.request.user.userId, productId, issueId)
        return this.issueService.deleteIssue(productId, issueId)
    } 
}