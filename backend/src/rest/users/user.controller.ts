import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { User, UserREST } from 'fhooe-audit-platform-common'
import { UserService } from './user.service'

@Controller('rest/users')
export class UserController implements UserREST {
    constructor(private userService: UserService) {

    }

    @Get()
    @ApiResponse({ type: [User] })
    async findAll(): Promise<User[]> {
        return this.userService.findAll()
    }
}