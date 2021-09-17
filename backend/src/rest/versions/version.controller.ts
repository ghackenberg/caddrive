import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Version, VersionREST } from 'fhooe-audit-platform-common'
import { VersionService } from './version.service'

@Controller('rest/versions')
export class VersionController implements VersionREST {
    constructor(private versionService: VersionService) {

    }

    @Get()
    @ApiQuery({ name: 'name' })
    @ApiResponse({ type: [Version] }) 
    async findVersions(@Query('name') name?: string, @Query('name') product?: string): Promise<Version[]> {
        return this.versionService.findVersions(name, product)
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
}