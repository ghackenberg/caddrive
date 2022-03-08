import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { Member, MemberData, MemberREST } from 'productboard-common'
import { MemberService } from './member.service'


@Controller('rest/members')
export class MemberController implements MemberREST {
    constructor(private readonly memberService: MemberService) {}
    @Get()
    findMembers(@Query('product') productId: string): Promise<Member[]> {
        return this.memberService.findMembers(productId)
    }
    @Post()
    addMember(@Body() data: MemberData): Promise<Member> {
        return this.memberService.addMember(data)
    }
    @Get(':id')
    getMember(@Param('id') id: string): Promise<Member> {
        return this.memberService.getMember(id)
    }
    @Put(':id')
    updateMember(@Param('id') id: string, @Body() data: MemberData): Promise<Member> {
        return this.memberService.updateMember(id,data)
    }
    @Delete(':id')
    deleteMember(@Param('id') id: string): Promise<Member> {
        return this.memberService.deleteMember(id)
    }
}