import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { User, UserData, UserREST } from 'fhooe-audit-platform-common'
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

    @Get(':id')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: User })
    async getUser(@Param('id') id: string): Promise<User> {
        return this.userService.getUser(id)
    }

    @Post()
    @ApiBody({ type: UserData })
    @ApiResponse({ type: User })
    async addUser(@Body() user: UserData): Promise<User> {
        return this.userService.addUser(user)
    }

    @Put()
    @ApiBody({ type: User })
    @ApiResponse({ type: User })
    async updateUser(@Body() user: User): Promise<User> {
        return this.userService.updateUser(user)
    }
}