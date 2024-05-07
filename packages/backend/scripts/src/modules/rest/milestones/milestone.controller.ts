import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'

import { MilestoneCreate, MilestoneREST, MilestoneRead, MilestoneUpdate } from 'productboard-common'

import { MilestoneService } from './milestone.service'
import { canReadMilestoneOrFail, canDeleteMilestoneOrFail, canUpdateMilestoneOrFail, canCreateMilestoneOrFail, canFindMilestoneOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/milestones')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class MilestoneController implements MilestoneREST {
    constructor(
        private readonly milestoneService: MilestoneService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: [MilestoneRead] })
    async findMilestones(
        @Param('productId') productId: string
    ): Promise<MilestoneRead[]> {
        await canFindMilestoneOrFail(this.request.user, productId)
        return this.milestoneService.findMilestones(productId)
    }   

    @Post()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiBody({ type: MilestoneCreate })
    @ApiResponse({ type: MilestoneRead })
    async addMilestone(
        @Param('productId') productId: string,
        @Body() data: MilestoneCreate
    ): Promise<MilestoneRead> {
        await canCreateMilestoneOrFail(this.request.user, productId)
        return this.milestoneService.addMilestone(productId, data)
    }
    @Get(':milestoneId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'milestoneId', type: 'string', required: true })
    @ApiResponse({ type: MilestoneRead })
    async getMilestone(
        @Param('productId') productId: string,
        @Param('milestoneId') milestoneId: string
    ): Promise<MilestoneRead> {
        await canReadMilestoneOrFail(this.request.user, productId, milestoneId)
        return this.milestoneService.getMilestone(productId, milestoneId)
    }
    @Put(':milestoneId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'milestoneId', type: 'string', required: true })
    @ApiBody({ type: MilestoneUpdate })
    @ApiResponse({ type: MilestoneRead })
    async updateMilestone(
        @Param('productId') productId: string,
        @Param('milestoneId') milestoneId: string,
        @Body() data: MilestoneUpdate
    ): Promise<MilestoneRead> {
        await canUpdateMilestoneOrFail(this.request.user, productId, milestoneId)
        return this.milestoneService.updateMilestone(productId, milestoneId, data)
    }
    @Delete(':milestoneId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'milestoneId', type: 'string', required: true })
    @ApiResponse({ type: MilestoneRead })
    async deleteMilestone(
        @Param('productId') productId: string,
        @Param('milestoneId') milestoneId: string
    ): Promise<MilestoneRead> {
        await canDeleteMilestoneOrFail(this.request.user, productId, milestoneId)
        return this.milestoneService.deleteMilestone(productId, milestoneId)
    }
}