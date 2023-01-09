import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiResponse, ApiParam, ApiQuery, ApiConsumes, getSchemaPath, ApiExtraModels, ApiBearerAuth } from '@nestjs/swagger'

import { Request } from 'express'
import 'multer'

import { User, Version, VersionAddData, VersionREST, VersionUpdateData } from 'productboard-common'

import { canReadVersionOrFail, canDeleteVersionOrFail, canUpdateVersionOrFail, canCreateVersionOrFail, canFindVersionOrFail } from '../../../functions/permission'
import { AuthGuard } from '../users/auth.guard'
import { VersionService } from './version.service'

@Controller('rest/versions')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiExtraModels(VersionAddData, VersionUpdateData)
export class VersionController implements VersionREST<string, string, Express.Multer.File[], Express.Multer.File[]> {
    constructor(
        private versionService: VersionService,
        @Inject(REQUEST)
        private readonly request: Request & { user: User }
    ) {}

    @Get()
    @ApiQuery({ name: 'product', type: 'string', required: true })
    @ApiResponse({ type: [Version] }) 
    async findVersions(
        @Query('product') productId: string
    ): Promise<Version[]> {
        await canFindVersionOrFail(this.request.user, productId)
        return this.versionService.findVersions(productId)
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'model', maxCount: 1 },
            { name: 'image', maxCount: 1 }
        ])
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(VersionAddData) },
                model: { type: 'string', format: 'binary' },
                image: { type: 'string', format: 'binary' }
            },
            required: ['data', 'model', 'image']
        },
        required: true
    })
    @ApiResponse({ type: Version })
    async addVersion(
        @Body('data') data: string,
        @UploadedFiles() files: { model: Express.Multer.File[], image: Express.Multer.File[] }
    ): Promise<Version> {
        const dataParsed = <VersionAddData> JSON.parse(data)
        await canCreateVersionOrFail(this.request.user, dataParsed.productId)
        return this.versionService.addVersion(dataParsed, files)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async getVersion(
        @Param('id') id: string
    ): Promise<Version> {
        await canReadVersionOrFail(this.request.user, id)
        return this.versionService.getVersion(id)
    }

    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'model', maxCount: 1 },
            { name: 'image', maxCount: 1 }
        ])
    )
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                data: { $ref: getSchemaPath(VersionUpdateData) },
                model: { type: 'string', format: 'binary' },
                image: { type: 'string', format: 'binary' }
            },
            required: ['data']
        },
        required: true
    })
    @ApiResponse({ type: Version })
    async updateVersion(
        @Param('id') id: string,
        @Body('data') data: string,
        @UploadedFiles() files?: { model: Express.Multer.File[], image: Express.Multer.File[] }
    ): Promise<Version> {
        await canUpdateVersionOrFail(this.request.user, id)
        return this.versionService.updateVersion(id, JSON.parse(data), files)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async deleteVersion(
        @Param('id') id: string
    ): Promise<Version> {
        await canDeleteVersionOrFail(this.request.user, id)
        return this.versionService.deleteVersion(id)
    }
}