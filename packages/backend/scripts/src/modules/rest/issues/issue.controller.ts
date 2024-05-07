import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiResponse } from '@nestjs/swagger'

import "multer"

import { IssueCreate, IssueREST, IssueRead, IssueUpdate } from 'productboard-common'

import { IssueService } from './issue.service'
import { canReadIssueOrFail, canUpdateIssueOrFail, canDeleteIssueOrFail, canCreateIssueOrFail, canReadProductOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/issues')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(IssueCreate, IssueUpdate)
export class IssueController implements IssueREST {
    constructor(
        private readonly issueService: IssueService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: [IssueRead] })
    async findIssues(
        @Param('productId') productId: string
    ): Promise<IssueRead[]> {
        await canReadProductOrFail(this.request.user, productId)
        return this.issueService.findIssues(productId)
    }

    @Post()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiBody({ type: IssueCreate,  required: true })
    @ApiResponse({ type: IssueRead })
    async addIssue(
        @Param('productId') productId: string,
        @Body() data: IssueCreate
    ): Promise<IssueRead> {
        await canCreateIssueOrFail(this.request.user, productId)
        return this.issueService.addIssue(productId, data)
    }  

    @Get(':issueId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiResponse({ type: IssueRead })
    async getIssue(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string
    ): Promise<IssueRead> {
        await canReadIssueOrFail(this.request.user, productId, issueId)
        return this.issueService.getIssue(productId, issueId)
    } 

    @Put(':issueId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
    @ApiBody({ type: IssueUpdate, required: true })
    @ApiResponse({ type: IssueRead })
    async updateIssue(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string,
        @Body() data: IssueUpdate
    ): Promise<IssueRead> {
        await canUpdateIssueOrFail(this.request.user, productId, issueId)
        return this.issueService.updateIssue(productId, issueId, data)
    }

    @Delete(':issueId')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: IssueRead })
    async deleteIssue(
        @Param('productId') productId: string,
        @Param('issueId') issueId: string
    ): Promise<IssueRead> {
        await canDeleteIssueOrFail(this.request.user, productId, issueId)
        return this.issueService.deleteIssue(productId, issueId)
    } 
}