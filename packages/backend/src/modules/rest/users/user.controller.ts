import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Scope, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { Request } from 'express'
import 'multer'
import { User, UserAddData, UserREST, UserUpdateData } from 'productboard-common'
import { canFindUserOrFail, canCreateUserOrFail, canReadUserOrFail, canUpdateUserOrFail, canDeleteUserOrFail } from '../../../functions/permission'
import { UserService } from './user.service'

@Controller({path: 'rest/users', scope: Scope.REQUEST})
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
@ApiExtraModels(UserAddData, UserUpdateData)
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
    async findUsers(
        @Query('query') query?: string,
        @Query('product') product?: string
    ): Promise<User[]> {
        await canFindUserOrFail((<User> this.request.user).id, query, product)
        return this.userService.findUsers(query, product)
    }
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(UserAddData) },
                file: { type: 'string', format: 'binary' }
            },
            required: ['data', 'file']
        }
    })
    @ApiResponse({ type: User })
    async addUser(
        @Body('data') data: string,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<User> {
        await canCreateUserOrFail((<User> this.request.user).id)
        return this.userService.addUser(JSON.parse(data), file)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: User })
    async getUser(
        @Param('id') id: string
    ): Promise<User> {
        await canReadUserOrFail((<User> this.request.user).id, id)
        return this.userService.getUser(id)
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(UserUpdateData) },
                file: { type: 'string', format: 'binary' }
            },
            required: ['data']
        }
    })
    @ApiResponse({ type: User })
    async updateUser(
        @Param('id') id: string,
        @Body('data') data: string,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<User> {
        await canUpdateUserOrFail((<User> this.request.user).id, id)
        return this.userService.updateUser(id, JSON.parse(data), file)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: User })
    async deleteUser(
        @Param('id') id: string
    ): Promise<User> {
        await canDeleteUserOrFail((<User> this.request.user).id, id)
        return this.userService.deleteUser(id)
    }
}