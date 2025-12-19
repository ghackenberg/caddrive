import { Module } from '@nestjs/common'
import { MemberController } from './member.controller.js'
import { MemberService } from './member.service.js'

@Module({
    controllers: [MemberController],
    providers: [MemberService]
})
export class MemberModule {}