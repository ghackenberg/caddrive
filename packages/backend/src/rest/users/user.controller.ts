import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Scope, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Request } from 'express'
import 'multer'
import { User, UserAddData, UserUpdateData, UserREST } from 'productboard-common'
import { UserService } from './user.service'

@Controller({path: 'rest/users', scope: Scope.REQUEST})
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class UserController implements UserREST<string, Express.Multer.File> {
    constructor(
        private readonly userService: UserService,
        @Inject(REQUEST)
        private readonly request: Request
    ) {}

    @Get('check')
    @ApiResponse({ type: User })
    async checkUser(): Promise<User> {
        return <User> this.request.user
    }

    @Get()
    @ApiQuery({ name: 'query', type: 'string', required: false })
    @ApiQuery({ name: 'product', type: 'string', required: false })
    @ApiResponse({ type: [User] })
    async findUsers(@Query('query') query?: string, @Query('product') product?: string): Promise<User[]> {
        return this.userService.findUsers(query, product)
    }
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({ type: UserAddData, required: true })
    @ApiResponse({ type: User })
    async addUser(
        @Body('data') data: string,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<User> {
        return this.userService.addUser(JSON.parse(data), file)
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
    @UseInterceptors(FileInterceptor('file'))
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: UserUpdateData, required: true })
    @ApiResponse({ type: User })
    async updateUser(
        @Param('id') id: string,
        @Body('data') data: string,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<User> {
        return this.userService.updateUser(id, JSON.parse(data), file)
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