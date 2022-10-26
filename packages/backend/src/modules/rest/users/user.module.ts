import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthStrategy } from './auth.strategy'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
    imports: [PassportModule],
    controllers: [UserController],
    providers: [UserService, AuthStrategy],
    exports: [UserService]
})
export class UserModule {}