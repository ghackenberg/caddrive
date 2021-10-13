import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Version, VersionREST } from 'fhooe-audit-platform-common'
import { VersionService } from './version.service'

@Controller('rest/versions')
export class VersionController implements VersionREST {
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
    @ApiBody({ type: Version })
    @ApiResponse({ type: Version })
    async addVersion(@Body() version: Version): Promise<Version> {
        return this.versionService.addVersion(version)
    }

    @Put()
    @ApiBody({ type: Version })
    @ApiResponse({ type: [Version] })
    async deleteVersion(@Body() version: Version): Promise<Version[]> {
        return this.versionService.deleteVersion(version)
    }

    @Put(':id')
    @ApiBody({ type: Version })
    @ApiResponse({ type: Version })
    async updateVersion(@Body() version: Version): Promise<Version> {
        return this.versionService.updateVersion(version)
    }
}