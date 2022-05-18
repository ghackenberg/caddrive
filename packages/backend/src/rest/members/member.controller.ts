import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Member, MemberAddData, MemberUpdateData, MemberREST, User } from 'productboard-common'
import { MemberService } from './member.service'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { REQUEST } from '@nestjs/core'
import { MemberRepository } from 'productboard-database'

@Controller('rest/members')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class MemberController implements MemberREST {
    constructor(
        private readonly memberService: MemberService,
        @Inject(REQUEST)
        private readonly request: Express.Request
        ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiQuery({ name: 'user', type: 'string', required: false })
    @ApiResponse({ type: [Member] })
    async findMembers(
        @Query('product') productId: string,
        @Query('user') userId?: string
    ): Promise<Member[]> {
        try {
            await MemberRepository.findOneByOrFail({ productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.memberService.findMembers(productId, userId)
    }

    @Post()
    @ApiBody({ type: MemberAddData, required: true })
    @ApiResponse({ type: Member })
    async addMember(
        @Body() data: MemberAddData
    ): Promise<Member> {
        try {
            await MemberRepository.findOneByOrFail({ productId: data.productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.memberService.addMember(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Member })
    async getMember(
        @Param('id') id: string
    ): Promise<Member> {
        const member = await MemberRepository.findOneByOrFail({ id })
        try {
            await MemberRepository.findOneByOrFail({ productId: member.productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return member
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Member, required: true })
    @ApiResponse({ type: Member })
    async updateMember(
        @Param('id') id: string,
        @Body() data: MemberUpdateData
    ): Promise<Member> {
        const member = await MemberRepository.findOneByOrFail({ id })
        try {
            await MemberRepository.findOneByOrFail({ productId: member.productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.memberService.updateMember(id,data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Member] })
    async deleteMember(
        @Param('id') id: string
    ): Promise<Member> {
        const member = await MemberRepository.findOneByOrFail({ id })
        try {
            await MemberRepository.findOneByOrFail({ productId: member.productId, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.memberService.deleteMember(id)
    }
}