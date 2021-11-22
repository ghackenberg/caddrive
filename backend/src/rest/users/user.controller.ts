import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Scope, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { User, UserData, UserREST } from 'fhooe-audit-platform-common'
import { UserService } from './user.service'

@Controller({path: 'rest/users', scope: Scope.REQUEST})
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class UserController implements UserREST {
    constructor(
        private readonly userService: UserService,
        @Inject(REQUEST)
        private readonly request: Express.Request
    ) {}

    @Get('check')
    @ApiResponse({ type: User })
    async checkUser(): Promise<User> {
        return <User> this.request.user
    }

    @Get()
    @ApiResponse({ type: [User] })
    async findUsers(): Promise<User[]> {
        return this.userService.findUsers()
    }
  
    @Post()
    @ApiBody({ type: UserData, required: true })
    @ApiResponse({ type: User })
    async addUser(
        @Body() data: UserData
    ): Promise<User> {
        return this.userService.addUser(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: User })
    async getUser(
        @Param('id') id: string
    ): Promise<User> {
        return this.userService.getUser(id)
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: UserData, required: true })
    @ApiResponse({ type: User })
    async updateUser(
        @Param('id') id: string,
        @Body() data: UserData
    ): Promise<User> {
        return this.userService.updateUser(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: User })
    async deleteUser(
        @Param('id') id: string
    ): Promise<User> {
        return this.userService.deleteUser(id)
    }
}