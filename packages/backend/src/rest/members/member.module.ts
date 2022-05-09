import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from '../products/product.entity'
import { UserEntity } from '../users/user.entity'
import { MemberController } from './member.controller'
import { MemberEntity } from './member.entity'
import { MemberService } from './member.service'

@Module({
    controllers: [MemberController],
    providers: [MemberService],
    imports: [TypeOrmModule.forFeature([MemberEntity]), TypeOrmModule.forFeature([ProductEntity]), TypeOrmModule.forFeature([UserEntity])],
    exports: [MemberService]
})
export class MemberModule {}