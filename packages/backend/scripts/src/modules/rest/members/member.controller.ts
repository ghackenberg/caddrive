import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'

import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'

import { MemberService } from './member.service'
import { canReadMemberOrFail, canUpdateMemberOrFail, canDeleteMemberOrFail, canFindMemberOrFail, canCreateMemberOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/members')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class MemberController implements MemberREST {
    constructor(
        private readonly memberService: MemberService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiQuery({ name: 'user', type: 'string', required: false })
    @ApiResponse({ type: [Member] })
    async findMembers(
        @Query('product') productId: string,
        @Query('user') userId?: string
    ): Promise<Member[]> {
        await canFindMemberOrFail(this.request.user, productId)
        return this.memberService.findMembers(productId, userId)
    }

    @Post()
    @ApiBody({ type: MemberAddData, required: true })
    @ApiResponse({ type: Member })
    async addMember(
        @Body() data: MemberAddData
    ): Promise<Member> {
        await canCreateMemberOrFail(this.request.user, data.productId)
        return this.memberService.addMember(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Member })
    async getMember(
        @Param('id') id: string
    ): Promise<Member> {
        await canReadMemberOrFail(this.request.user, id)
        return this.memberService.getMember(id)
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Member, required: true })
    @ApiResponse({ type: Member })
    async updateMember(
        @Param('id') id: string,
        @Body() data: MemberUpdateData
    ): Promise<Member> {
        await canUpdateMemberOrFail(this.request.user, id)
        return this.memberService.updateMember(id,data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Member] })
    async deleteMember(
        @Param('id') id: string
    ): Promise<Member> {
        await canDeleteMemberOrFail(this.request.user, id)
        return this.memberService.deleteMember(id)
    }
}