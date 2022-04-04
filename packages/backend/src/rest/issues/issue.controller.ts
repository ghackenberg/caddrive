import { Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Issue, IssueAddData, IssueUpdateData, IssueREST, User } from 'productboard-common'
import { IssueService } from './issue.service'
import { MemberService } from '../members/member.service'
import { REQUEST } from '@nestjs/core'

@Controller('rest/issues')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class IssueController implements IssueREST {
    constructor(
        private readonly issueService: IssueService,
        private readonly memberService: MemberService,
        @Inject(REQUEST)
        private readonly request: Express.Request
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiQuery({ name: 'milestone', type: 'string', required: false })
    @ApiQuery({ name: 'state', type: 'string', required: false })
    @ApiResponse({ type: [Issue] })
    async findIssues(
        @Query('product') productId: string,
        @Query('milestone') milestoneId?: string,
        @Query('state') state?: string
    ): Promise<Issue[]> {
        return this.issueService.findIssues(productId, milestoneId, state)
    }

    @Post()
    @ApiBody({ type: IssueAddData, required: true })
    @ApiResponse({ type: Issue })
    async addIssue(
        @Body() data: IssueAddData
    ): Promise<Issue> {
        if (!data) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(data.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return this.issueService.addIssue(data)
    }  

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Issue })
    async getIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        const issue = await this.issueService.getIssue(id)
        if (!issue) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(issue.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
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
        const issue = await this.issueService.getIssue(id)
        if (!issue) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(issue.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return this.issueService.updateIssue(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Issue] })
    async deleteIssue(
        @Param('id') id: string
    ): Promise<Issue> {
        const issue = await this.issueService.getIssue(id)
        if (!issue) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(issue.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return this.issueService.deleteIssue(id)
    } 
}