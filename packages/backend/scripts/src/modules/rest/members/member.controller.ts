import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'

import { MemberCreate, MemberREST, MemberRead, MemberUpdate } from 'productboard-common'

import { MemberService } from './member.service'
import { canReadMemberOrFail, canUpdateMemberOrFail, canDeleteMemberOrFail, canFindMemberOrFail, canCreateMemberOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/members')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class MemberController implements MemberREST {
    constructor(
        private readonly memberService: MemberService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: [MemberRead] })
    async findMembers(
        @Param('productId') productId: string
    ): Promise<MemberRead[]> {
        await canFindMemberOrFail(this.request.user && this.request.user.userId, productId)
        return this.memberService.findMembers(productId)
    }

    @Post()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiBody({ type: MemberCreate, required: true })
    @ApiResponse({ type: MemberRead })
    async addMember(
        @Param('productId') productId: string,
        @Body() data: MemberCreate
    ): Promise<MemberRead> {
        await canCreateMemberOrFail(this.request.user && this.request.user.userId, productId)
        return this.memberService.addMember(productId, data)
    }

    @Get(':memberId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'memberId', type: 'string', required: true })
    @ApiResponse({ type: MemberRead })
    async getMember(
        @Param('productId') productId: string,
        @Param('memberId') memberId: string
    ): Promise<MemberRead> {
        await canReadMemberOrFail(this.request.user && this.request.user.userId, productId, memberId)
        return this.memberService.getMember(productId, memberId)
    }

    @Put(':memberId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'memberId', type: 'string', required: true })
    @ApiBody({ type: MemberUpdate, required: true })
    @ApiResponse({ type: MemberRead })
    async updateMember(
        @Param('productId') productId: string,
        @Param('memberId') memberId: string,
        @Body() data: MemberUpdate
    ): Promise<MemberRead> {
        await canUpdateMemberOrFail(this.request.user && this.request.user.userId, productId, memberId)
        return this.memberService.updateMember(productId, memberId, data)
    }

    @Delete(':memberId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'memberId', type: 'string', required: true })
    @ApiResponse({ type: MemberRead })
    async deleteMember(
        @Param('productId') productId: string,
        @Param('memberId') memberId: string
    ): Promise<MemberRead> {
        await canDeleteMemberOrFail(this.request.user && this.request.user.userId, productId, memberId)
        return this.memberService.deleteMember(productId, memberId)
    }
}