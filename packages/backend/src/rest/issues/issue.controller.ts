import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Issue, IssueData, IssueREST } from 'productboard-common'
import { IssueService } from './issue.service'

@Controller('rest/issues')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class IssueController implements IssueREST {
    constructor(
        private readonly IssueService: IssueService
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiResponse({ type: [Issue] })
    async findIssues(
        @Query('product') productId: string
    ): Promise<Issue[]> {
        return this.IssueService.findIssues(productId)
    }

    @Post()
    @ApiBody({ type: IssueData, required: true })
    @ApiResponse({ type: Issue })
    async addIssue(
        @Body() data: IssueData
    ): Promise<Issue> {
        return this.IssueService.addIssue(data)
    }  

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Issue })
    async getIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        return this.IssueService.getIssue(id)
    } 

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Issue, required: true })
    @ApiResponse({ type: Issue })
    async updateIssue(
        @Param('id') id: string,
        @Body() data: IssueData
    ): Promise<Issue> {
        return this.IssueService.updateIssue(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Issue] })
    async deleteIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        return this.IssueService.deleteIssue(id)
    } 
}