import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemberController } from './member.controller'
import { MemberEntity } from './member.entity'
import { MemberService } from './member.service'

@Module({
    controllers: [MemberController],
    providers: [MemberService],
    imports: [TypeOrmModule.forFeature([MemberEntity])],
    exports: [MemberService]
})
export class MemberModule {}