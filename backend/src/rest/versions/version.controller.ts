import 'multer'
import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Version, VersionREST } from 'fhooe-audit-platform-common'
import { VersionService } from './version.service'

@Controller('rest/versions')
export class VersionController implements VersionREST<Express.Multer.File> {
    constructor(private versionService: VersionService) {

    }

    @Get()
    @ApiQuery({ name: 'quick' })
    @ApiQuery({ name: 'name' })
    @ApiQuery({ name: 'product' })
    @ApiResponse({ type: [Version] }) 
    async findVersions(@Query('quick') quick?: string, @Query('name') name?: string, @Query('product') product?: string): Promise<Version[]> {
        return this.versionService.findVersions(quick, name, product)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: Version })
    async getVersion(@Param('id') id: string): Promise<Version> {
        return this.versionService.getVersion(id)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({ type: Version })
    @ApiResponse({ type: Version })
    async addVersion(@Body() version: Version, @UploadedFile() file: Express.Multer.File): Promise<Version> {
        return this.versionService.addVersion(version, file)
    }

    @Put()
    @ApiBody({ type: Version })
    @ApiResponse({ type: [Version] })
    async deleteVersion(@Body() version: Version): Promise<Version[]> {
        return this.versionService.deleteVersion(version)
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({ type: Version })
    @ApiResponse({ type: Version })
    async updateVersion(@Body() version: Version, @UploadedFile() file?: Express.Multer.File): Promise<Version> {
        return this.versionService.updateVersion(version, file)
    }
}