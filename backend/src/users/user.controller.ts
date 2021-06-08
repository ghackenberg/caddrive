import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { User } from 'fhooe-audit-platform-common'
import { UserService } from './user.service'

@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) {

    }

    @Get()
    @ApiResponse({ type: [User] })
    async findAll(): Promise<User[]> {
        return this.userService.findAll()
    }
}