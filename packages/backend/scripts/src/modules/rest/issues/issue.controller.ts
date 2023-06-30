import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger'

import "multer"

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'

import { IssueService } from './issue.service'
import { canReadIssueOrFail, canUpdateIssueOrFail, canDeleteIssueOrFail, canCreateIssueOrFail, canReadProductOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/issues')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(IssueAddData, IssueUpdateData)
export class IssueController implements IssueREST<string, string, Express.Multer.File[]> {
    constructor(
        private readonly issueService: IssueService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
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
        await canReadProductOrFail(this.request.user, productId)
        return this.issueService.findIssues(productId, milestoneId, state)
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'audio', maxCount: 1 }]
        )
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(IssueAddData) },
                audio: { type: 'string', format: 'binary' }
            },
            required: ['data']
        },
        required: true
    })
    @ApiResponse({ type: Issue })
    async addIssue(
        @Body('data') data: string,
        @UploadedFiles() files: { audio?: Express.Multer.File[] }
    ): Promise<Issue> {
        const parsedData = JSON.parse(data) as IssueAddData
        await canCreateIssueOrFail(this.request.user, parsedData.productId)
        return this.issueService.addIssue(parsedData, files)
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
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'audio', maxCount: 1 }]
        )
    )
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(IssueUpdateData) },
                audio: { type: 'string', format: 'binary' }
            },
            required: ['data']
        },
        required: true
    })
    @ApiResponse({ type: Issue })
    async updateIssue(
        @Param('id') id: string,
        @Body('data') data: string,
        @UploadedFiles() files?: { audio?: Express.Multer.File[] }
    ): Promise<Issue> {
        const parsedData = JSON.parse(data) as IssueUpdateData
        await canUpdateIssueOrFail(this.request.user, id)
        return this.issueService.updateIssue(id, parsedData, files)
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