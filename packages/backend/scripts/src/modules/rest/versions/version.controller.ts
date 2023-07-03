import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiResponse, ApiParam, ApiConsumes, getSchemaPath, ApiExtraModels, ApiBearerAuth } from '@nestjs/swagger'

import 'multer'

import { Version, VersionAddData, VersionREST, VersionUpdateData } from 'productboard-common'

import { VersionService } from './version.service'
import { canReadVersionOrFail, canDeleteVersionOrFail, canUpdateVersionOrFail, canCreateVersionOrFail, canFindVersionOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/versions')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(VersionAddData, VersionUpdateData)
export class VersionController implements VersionREST<string, string, Express.Multer.File[], Express.Multer.File[]> {
    constructor(
        private versionService: VersionService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: [Version] }) 
    async findVersions(
        @Param('productId') productId: string
    ): Promise<Version[]> {
        await canFindVersionOrFail(this.request.user && this.request.user.userId, productId)
        return this.versionService.findVersions(productId)
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'model', maxCount: 1 },
            { name: 'image', maxCount: 1 }
        ])
    )
    @ApiParam({ name: 'productId', type: 'string', required: true })
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
        @Param('productId') productId: string,
        @Body('data') data: string,
        @UploadedFiles() files: { model: Express.Multer.File[], image: Express.Multer.File[] }
    ): Promise<Version> {
        const dataParsed = <VersionAddData> JSON.parse(data)
        await canCreateVersionOrFail(this.request.user && this.request.user.userId, productId)
        return this.versionService.addVersion(productId, dataParsed, files)
    }

    @Get(':versionId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'versionId', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async getVersion(
        @Param('productId') productId: string,
        @Param('versionId') versionId: string
    ): Promise<Version> {
        await canReadVersionOrFail(this.request.user && this.request.user.userId, productId, versionId)
        return this.versionService.getVersion(productId, versionId)
    }

    @Put(':versionId')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'model', maxCount: 1 },
            { name: 'image', maxCount: 1 }
        ])
    )
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'versionId', type: 'string', required: true })
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
        @Param('productId') productId: string,
        @Param('versionId') versionId: string,
        @Body('data') data: string,
        @UploadedFiles() files?: { model: Express.Multer.File[], image: Express.Multer.File[] }
    ): Promise<Version> {
        await canUpdateVersionOrFail(this.request.user && this.request.user.userId, productId, versionId)
        return this.versionService.updateVersion(productId, versionId, JSON.parse(data), files)
    }

    @Delete(':versionId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'versionId', type: 'string', required: true })
    @ApiResponse({ type: Version })
    async deleteVersion(
        @Param('productId') productId: string,
        @Param('versionId') versionId: string
    ): Promise<Version> {
        await canDeleteVersionOrFail(this.request.user && this.request.user.userId, productId, versionId)
        return this.versionService.deleteVersion(productId, versionId)
    }
}