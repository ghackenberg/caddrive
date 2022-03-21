import 'multer'
import { Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiResponse, ApiParam, ApiQuery, ApiBasicAuth } from '@nestjs/swagger'
import { User, Version, VersionAddData, VersionREST } from 'productboard-common'
import { VersionService } from './version.service'
import { AuthGuard } from '@nestjs/passport'
import { MemberService } from '../members/member.service'
import { REQUEST } from '@nestjs/core'

@Controller('rest/versions')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class VersionController implements VersionREST<string, Express.Multer.File> {
    constructor(
        private versionService: VersionService,
        private readonly memberService: MemberService,
        @Inject(REQUEST)
        private readonly request: Express.Request
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiResponse({ type: [Version] }) 
    async findVersions(
        @Query('product') product: string
    ): Promise<Version[]> {
        return this.versionService.findVersions(product)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({ type: VersionAddData, required: true })
    @ApiResponse({ type: Version })
    async addVersion(
        @Body('data') data: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Version> {
        const dataParsed = <VersionAddData> JSON.parse(data)
        if ((await this.memberService.findMembers(dataParsed.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return this.versionService.addVersion(dataParsed, file)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async getVersion(
        @Param('id') id: string
    ): Promise<Version> {
        const version = await this.versionService.getVersion(id)
        if (!version) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(version.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return version
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Version, required: true })
    @ApiResponse({ type: Version })
    async updateVersion(
        @Param('id') id: string,
        @Body('data') data: string,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<Version> {
        const version = await this.versionService.getVersion(id)
        if (!version) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(version.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return this.versionService.updateVersion(id, JSON.parse(data), file)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async deleteVersion(
        @Param('id') id: string
    ): Promise<Version> {
        const version = await this.versionService.getVersion(id)
        if (!version) {
            throw new NotFoundException()
        }
        if ((await this.memberService.findMembers(version.productId, (<User> this.request.user).id)).length == 0) {
            throw new ForbiddenException()
        }
        return this.versionService.deleteVersion(id)
    }
}