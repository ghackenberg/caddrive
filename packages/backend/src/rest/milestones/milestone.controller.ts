import { Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData, User } from 'productboard-common'
import { getMemberOrFail, getMilestoneOrFail, getProductOrFail, getUserOrFail } from 'productboard-database'
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
    async findMilestones(
        @Query('product') productId: string
    ): Promise<Milestone[]> {
        const product = await getProductOrFail({ id: productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id, userId: user.id, deleted: false }, ForbiddenException)
        return this.milestoneService.findMilestones(productId)
    }   

    @Post()
    @ApiBody({ type: MilestoneAddData })
    @ApiResponse({ type: Milestone })
    async addMilestone(
        @Body() data: MilestoneAddData
    ): Promise<Milestone> {
        const product = await getProductOrFail({ id: data.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id, userId: user.id, deleted: false }, ForbiddenException)
        return this.milestoneService.addMilestone(data)
    }
    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Milestone })
    async getMilestone(
        @Param('id') id: string
    ): Promise<Milestone> {
        const milestone = await getMilestoneOrFail({ id, deleted: false }, NotFoundException)
        const product = await getProductOrFail({ id: milestone.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id, userId: user.id, deleted: false }, ForbiddenException)
        return this.milestoneService.getMilestone(id)
    }
    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: MilestoneUpdateData })
    @ApiResponse({ type: Milestone })
    async updateMilestone(
        @Param('id') id: string,
        @Body() data: MilestoneUpdateData
    ): Promise<Milestone> {
        const milestone = await getMilestoneOrFail({ id, deleted: false }, NotFoundException)
        const product = await getProductOrFail({ id: milestone.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id, userId: user.id, deleted: false }, ForbiddenException)
        return this.milestoneService.updateMilestone(id, data)
    }
    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Milestone })
    async deleteMilestone(
        @Param('id') id: string
    ): Promise<Milestone> {
        const milestone = await getMilestoneOrFail({ id, deleted: false }, NotFoundException)
        const product = await getProductOrFail({ id: milestone.productId, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id, userId: user.id, deleted: false }, ForbiddenException)
        return this.milestoneService.deleteMilestone(id)
    }
}