import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiResponse, getSchemaPath } from '@nestjs/swagger'

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
export class IssueController implements IssueREST<string, string, Express.Multer.File[]> {
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
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'audio', maxCount: 1 }]
        )
    )
    @ApiParam({ name: 'productId', type: 'string', required: true })
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
        @Param('productId') productId: string,
        @Body('data') data: string,
        @UploadedFiles() files: { audio?: Express.Multer.File[] }
    ): Promise<Issue> {
        await canCreateIssueOrFail(this.request.user && this.request.user.userId, productId)
        return this.issueService.addIssue(productId, JSON.parse(data), files)
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
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'audio', maxCount: 1 }]
        )
    )
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'issueId', type: 'string', required: true })
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
        @Param('productId') productId: string,
        @Param('issueId') issueId: string,
        @Body('data') data: string,
        @UploadedFiles() files?: { audio?: Express.Multer.File[] }
    ): Promise<Issue> {
        await canUpdateIssueOrFail(this.request.user && this.request.user.userId, productId, issueId)
        return this.issueService.updateIssue(productId, issueId, JSON.parse(data), files)
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