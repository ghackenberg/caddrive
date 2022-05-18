import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData, User } from 'productboard-common'
import { MemberRepository } from 'productboard-database'
import { MilestoneService } from './milestone.service'

@Controller('rest/milestones')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class MilestoneController implements MilestoneREST {
    constructor(
        private readonly milestoneService: MilestoneService,
        @Inject(REQUEST)
        private readonly request: Express.Request
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiResponse({ type: [Milestone] })
    async findMilestones(@Query('product') productId: string): Promise<Milestone[]> {
        await MemberRepository.findOneByOrFail({ productId: productId, userId: (<User> this.request.user).id, deleted: false })
        return this.milestoneService.findMilestones(productId)
    }   

    @Post()
    @ApiBody({ type: MilestoneAddData })
    @ApiResponse({ type: Milestone })
    async addMilestone(@Body() data: MilestoneAddData): Promise<Milestone> {
        await MemberRepository.findOneByOrFail({ productId: data.productId, userId: (<User> this.request.user).id, deleted: false })
        return this.milestoneService.addMilestone(data)
    }
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Milestone })
    async getMilestone(@Param('id') id: string): Promise<Milestone> {
        const milestone = await this.milestoneService.getMilestone(id)
        await MemberRepository.findOneByOrFail({ productId: milestone.productId, userId: (<User> this.request.user).id, deleted: false })
        return milestone
    }
    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: MilestoneUpdateData })
    @ApiResponse({ type: Milestone })
    async updateMilestone(@Param('id') id: string, @Body() data: MilestoneUpdateData): Promise<Milestone> {
        const milestone = await this.milestoneService.getMilestone(id)
        await MemberRepository.findOneByOrFail({ productId: milestone.productId, userId: (<User> this.request.user).id, deleted: false })
        return this.milestoneService.updateMilestone(id, data)
    }
    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Milestone })
    async deleteMilestone(@Param('id') id: string): Promise<Milestone> {
        const milestone = await this.milestoneService.getMilestone(id)
        await MemberRepository.findOneByOrFail({ productId: milestone.productId, userId: (<User> this.request.user).id, deleted: false })
        return this.milestoneService.deleteMilestone(id)
    }
}