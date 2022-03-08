import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { Member, MemberData, MemberREST } from 'productboard-common'
import { MemberService } from './member.service'

@Controller('rest/members')
export class MemberController implements MemberREST {
    constructor(private readonly memberService: MemberService) {}
    @Get()
    findMembers(@Query('product') _productId: string): Promise<Member[]> {
        return this.memberService.findMembers(_productId)
    }
    @Post()
    addMember(@Body() _data: MemberData): Promise<Member> {
        throw new Error('Method not implemented.');
    }
    @Get(':id')
    getMember(@Param('id') _id: string): Promise<Member> {
        throw new Error('Method not implemented.');
    }
    @Put(':id')
    updateMember(@Param('id') _id: string, @Body() _data: MemberData): Promise<Member> {
        throw new Error('Method not implemented.');
    }
    @Delete(':id')
    deleteMember(@Param('id') _id: string): Promise<Member> {
        throw new Error('Method not implemented.');
    }
}