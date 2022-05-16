import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemberEntity } from '../members/member.entity'
import { AuthStrategy } from './auth.strategy'
import { UserController } from './user.controller'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@Module({
    imports: [PassportModule, TypeOrmModule.forFeature([UserEntity]), TypeOrmModule.forFeature([MemberEntity])],
    controllers: [UserController],
    providers: [UserService, AuthStrategy],
    exports: [UserService]
})
export class UserModule {}