import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { MemberModule } from '../members/member.module'
import { AuthStrategy } from './auth.strategy'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
    imports: [PassportModule, MemberModule],
    controllers: [UserController],
    providers: [UserService, AuthStrategy],
    exports: [UserService]
})
export class UserModule {}