import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBody, ApiResponse, ApiParam, ApiQuery, ApiBasicAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import 'multer'
import { User, Version, VersionAddData, VersionREST } from 'productboard-common'
import { VersionService } from './version.service'
import { canReadVersionOrFail, canDeleteVersionOrFail, canUpdateVersionOrFail, canCreateVersionOrFail } from '../../permission'

@Controller('rest/versions')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class VersionController implements VersionREST<string, Express.Multer.File> {
    constructor(
        private versionService: VersionService,
        @Inject(REQUEST)
        private readonly request: Request
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiResponse({ type: [Version] }) 
    async findVersions(
        @Query('product') productId: string
    ): Promise<Version[]> {
        await canReadVersionOrFail((<User> this.request.user).id, productId)
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
        await canCreateVersionOrFail((<User> this.request.user).id, dataParsed.productId)
        return this.versionService.addVersion(dataParsed, file)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async getVersion(
        @Param('id') id: string
    ): Promise<Version> {
        await canReadVersionOrFail((<User> this.request.user).id, id)
        return this.versionService.getVersion(id)
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
        await canUpdateVersionOrFail((<User> this.request.user).id, id)
        return this.versionService.updateVersion(id, JSON.parse(data), file)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async deleteVersion(
        @Param('id') id: string
    ): Promise<Version> {
        await canDeleteVersionOrFail((<User> this.request.user).id, id)
        return this.versionService.deleteVersion(id)
    }
}