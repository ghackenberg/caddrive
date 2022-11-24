import 'multer'
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { Request } from 'express'
import { Issue, IssueAddData, IssueUpdateData, IssueREST, User } from 'productboard-common'

import { canReadIssueOrFail, canUpdateIssueOrFail, canDeleteIssueOrFail, canCreateIssueOrFail } from '../../../functions/permission'
import { IssueService } from './issue.service'

@Controller('rest/issues')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
@ApiExtraModels(IssueAddData, IssueUpdateData)
export class IssueController implements IssueREST<string, string, Express.Multer.File[]> {
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
        await canReadIssueOrFail((<User> this.request.user).id, productId)
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
        await canCreateIssueOrFail((<User> this.request.user).id, parsedData.productId)
        return this.issueService.addIssue(parsedData, files)
    }  

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Issue })
    async getIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        await canReadIssueOrFail((<User> this.request.user).id, id)
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
        await canUpdateIssueOrFail((<User> this.request.user).id, id)
        return this.issueService.updateIssue(id, parsedData, files)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Issue] })
    async deleteIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        await canDeleteIssueOrFail((<User> this.request.user).id, id)
        return this.issueService.deleteIssue(id)
    } 
}