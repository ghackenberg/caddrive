import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { ApiBody, ApiResponse } from '@nestjs/swagger'
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

    @Post()
    @ApiBody({ type: User })
    @ApiResponse({ type: User })
    async addUser(@Body() user: User): Promise<User> {
        return this.userService.addUser(user)
    }

    @Put()
    @ApiBody({ type: User })
    @ApiResponse({ type: User })
    async updateUser(@Body() user: User): Promise<User> {
        return this.userService.updateUser(user)
    }
}