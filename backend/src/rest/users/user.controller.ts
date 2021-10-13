import { Body, Controller, Get, Inject, Param, Post, Put, Query, Scope, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { User, UserData, UserREST } from 'fhooe-audit-platform-common'
import { UserService } from './user.service'

@Controller({path: 'rest/users', scope: Scope.REQUEST})
export class UserController implements UserREST {
    constructor(private readonly userService: UserService, @Inject(REQUEST) private readonly request: Express.Request) {

    }

    @UseGuards(AuthGuard('basic'))
    @Get('check')
    async checkUser(): Promise<User> {
        return <User> this.request.user
    }

    @UseGuards(AuthGuard('basic'))
    @Get()
    @ApiQuery({ name: 'quick' })
    @ApiQuery({ name: 'name' })
    @ApiQuery({ name: 'email' })
    @ApiResponse({ type: [User] })
    async findUsers(@Query('quick') quick?: string, @Query('name') name?: string, @Query('email') email?: string): Promise<User[]> {
        return this.userService.findUsers(quick, name, email)
    }
  
    @Post()
    @ApiBody({ type: UserData })
    @ApiResponse({ type: User })
    async addUser(@Body() user: UserData): Promise<User> {
        return this.userService.addUser(user)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: User })
    async getUser(@Param('id') id: string): Promise<User> {
        return this.userService.getUser(id)
    }

    @Put()
    @ApiBody({ type: User })
    @ApiResponse({ type: [User] })
    async deleteUser(@Body() user: User): Promise<User[]> {
        return this.userService.deleteUser(user)
    }

    @Put(':id')
    @ApiBody({ type: User })
    @ApiResponse({ type: User })
    async updateUser(@Body() user: User): Promise<User> {
        return this.userService.updateUser(user)
    }
}