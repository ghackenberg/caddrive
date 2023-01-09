import { Module } from '@nestjs/common'

import { AuthGuard } from './auth.guard'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, AuthGuard],
    exports: [UserService]
})
export class UserModule {}