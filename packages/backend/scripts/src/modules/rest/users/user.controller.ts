import { Body, Controller, Delete, Get, Inject, Param, Put, Query, Scope, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger'

import 'multer'

import { UserREST, UserRead, UserUpdate } from 'productboard-common'

import { UserService } from './user.service'
import { canFindUserOrFail, canReadUserOrFail, canUpdateUserOrFail, canDeleteUserOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller({path: 'rest/users', scope: Scope.REQUEST})
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(UserUpdate)
export class UserController implements UserREST<string, Express.Multer.File> {
    constructor(
        private readonly userService: UserService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiQuery({ name: 'productId', type: 'string', required: false })
    @ApiQuery({ name: 'query', type: 'string', required: false })
    @ApiResponse({ type: [UserRead] })
    async findUsers(
        @Query('productId') productId?: string,
        @Query('query') query?: string
    ): Promise<UserRead[]> {
        await canFindUserOrFail(this.request.user, productId, query)
        return this.userService.findUsers(productId, query)
    }

    @Get(':userId')
    @ApiParam({ name: 'userId', type: 'string', required: true })
    @ApiResponse({ type: UserRead })
    async getUser(
        @Param('userId') userId: string
    ): Promise<UserRead> {
        await canReadUserOrFail(this.request.user, userId)
        return this.userService.getUser(userId)
    }

    @Put(':userId')
    @UseInterceptors(FileInterceptor('file'))
    @ApiParam({ name: 'userId', type: 'string', required: true })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(UserUpdate) },
                file: { type: 'string', format: 'binary' }
            },
            required: ['data']
        }
    })
    @ApiResponse({ type: UserRead })
    async updateUser(
        @Param('userId') userId: string,
        @Body('data') data: string,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<UserRead> {
        await canUpdateUserOrFail(this.request.user, userId)
        return this.userService.updateUser(userId, JSON.parse(data), file)
    }

    @Delete(':userId')
    @ApiParam({ name: 'userId', type: 'string', required: true })
    @ApiResponse({ type: UserRead })
    async deleteUser(
        @Param('userId') userId: string
    ): Promise<UserRead> {
        await canDeleteUserOrFail(this.request.user, userId)
        return this.userService.deleteUser(userId)
    }
}