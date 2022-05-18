import 'multer'
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiResponse, ApiParam, ApiQuery, ApiBasicAuth } from '@nestjs/swagger'
import { User, Version, VersionAddData, VersionREST } from 'productboard-common'
import { VersionService } from './version.service'
import { AuthGuard } from '@nestjs/passport'
import { REQUEST } from '@nestjs/core'
import { MemberRepository } from 'productboard-database'

@Controller('rest/versions')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class VersionController implements VersionREST<string, Express.Multer.File> {
    constructor(
        private versionService: VersionService,
        @Inject(REQUEST)
        private readonly request: Express.Request
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiResponse({ type: [Version] }) 
    async findVersions(
        @Query('product') productId: string
    ): Promise<Version[]> {
        await MemberRepository.findOneByOrFail({ productId, userId: (<User> this.request.user).id, deleted: false })
        return this.versionService.findVersions(productId)
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
        await MemberRepository.findOneByOrFail({ productId: dataParsed.productId, userId: (<User> this.request.user).id, deleted: false })
        return this.versionService.addVersion(dataParsed, file)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async getVersion(
        @Param('id') id: string
    ): Promise<Version> {
        const version = await this.versionService.getVersion(id)
        await MemberRepository.findOneByOrFail({ productId: version.productId, userId: (<User> this.request.user).id, deleted: false })
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
        await MemberRepository.findOneByOrFail({ productId: version.productId, userId: (<User> this.request.user).id, deleted: false })
        return this.versionService.updateVersion(id, JSON.parse(data), file)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async deleteVersion(
        @Param('id') id: string
    ): Promise<Version> {
        const version = await this.versionService.getVersion(id)
        await MemberRepository.findOneByOrFail({ productId: version.productId, userId: (<User> this.request.user).id, deleted: false })
        return this.versionService.deleteVersion(id)
    }
}