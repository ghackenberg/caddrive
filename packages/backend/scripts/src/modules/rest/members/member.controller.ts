import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'

import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'

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
    @ApiResponse({ type: [Member] })
    async findMembers(
        @Param('productId') productId: string
    ): Promise<Member[]> {
        await canFindMemberOrFail(this.request.user && this.request.user.userId, productId)
        return this.memberService.findMembers(productId)
    }

    @Post()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiBody({ type: MemberAddData, required: true })
    @ApiResponse({ type: Member })
    async addMember(
        @Param('productId') productId: string,
        @Body() data: MemberAddData
    ): Promise<Member> {
        await canCreateMemberOrFail(this.request.user && this.request.user.userId, productId)
        return this.memberService.addMember(productId, data)
    }

    @Get(':memberId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'memberId', type: 'string', required: true })
    @ApiResponse({ type: Member })
    async getMember(
        @Param('productId') productId: string,
        @Param('memberId') memberId: string
    ): Promise<Member> {
        await canReadMemberOrFail(this.request.user && this.request.user.userId, productId, memberId)
        return this.memberService.getMember(productId, memberId)
    }

    @Put(':memberId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'memberId', type: 'string', required: true })
    @ApiBody({ type: Member, required: true })
    @ApiResponse({ type: Member })
    async updateMember(
        @Param('productId') productId: string,
        @Param('memberId') memberId: string,
        @Body() data: MemberUpdateData
    ): Promise<Member> {
        await canUpdateMemberOrFail(this.request.user && this.request.user.userId, productId, memberId)
        return this.memberService.updateMember(productId, memberId, data)
    }

    @Delete(':memberId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'memberId', type: 'string', required: true })
    @ApiResponse({ type: [Member] })
    async deleteMember(
        @Param('productId') productId: string,
        @Param('memberId') memberId: string
    ): Promise<Member> {
        await canDeleteMemberOrFail(this.request.user && this.request.user.userId, productId, memberId)
        return this.memberService.deleteMember(productId, memberId)
    }
}