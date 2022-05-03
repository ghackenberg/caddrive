import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MemberModule } from '../members/member.module'
import { AuthStrategy } from './auth.strategy'
import { UserController } from './user.controller'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@Module({
    imports: [PassportModule, MemberModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, AuthStrategy],
    exports: [UserService]
})
export class UserModule {}