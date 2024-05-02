import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiResponse, ApiParam, ApiConsumes, getSchemaPath, ApiExtraModels, ApiBearerAuth } from '@nestjs/swagger'

import 'multer'

import { VersionCreate, VersionREST, VersionRead, VersionUpdate } from 'productboard-common'

import { VersionService } from './version.service'
import { canReadVersionOrFail, canDeleteVersionOrFail, canUpdateVersionOrFail, canCreateVersionOrFail, canFindVersionOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products/:productId/versions')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
@ApiExtraModels(VersionCreate, VersionUpdate)
export class VersionController implements VersionREST<string, string, Express.Multer.File[], Express.Multer.File[]> {
    constructor(
        private versionService: VersionService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: [VersionRead] }) 
    async findVersions(
        @Param('productId') productId: string
    ): Promise<VersionRead[]> {
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
                data: { $ref: getSchemaPath(VersionCreate) },
                model: { type: 'string', format: 'binary' },
                image: { type: 'string', format: 'binary' }
            },
            required: ['data', 'model', 'image']
        },
        required: true
    })
    @ApiResponse({ type: VersionRead })
    async addVersion(
        @Param('productId') productId: string,
        @Body('data') data: string,
        @UploadedFiles() files: { model: Express.Multer.File[], image: Express.Multer.File[] }
    ): Promise<VersionRead> {
        const dataParsed = <VersionCreate> JSON.parse(data)
        await canCreateVersionOrFail(this.request.user && this.request.user.userId, productId)
        return this.versionService.addVersion(productId, dataParsed, files)
    }

    @Get(':versionId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'versionId', type: 'string', required: true })
    @ApiResponse({ type: VersionRead })
    async getVersion(
        @Param('productId') productId: string,
        @Param('versionId') versionId: string
    ): Promise<VersionRead> {
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
                data: { $ref: getSchemaPath(VersionUpdate) },
                model: { type: 'string', format: 'binary' },
                image: { type: 'string', format: 'binary' }
            },
            required: ['data']
        },
        required: true
    })
    @ApiResponse({ type: VersionRead })
    async updateVersion(
        @Param('productId') productId: string,
        @Param('versionId') versionId: string,
        @Body('data') data: string,
        @UploadedFiles() files?: { model: Express.Multer.File[], image: Express.Multer.File[] }
    ): Promise<VersionRead> {
        await canUpdateVersionOrFail(this.request.user && this.request.user.userId, productId, versionId)
        return this.versionService.updateVersion(productId, versionId, JSON.parse(data), files)
    }

    @Delete(':versionId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiParam({ name: 'versionId', type: 'string', required: true })
    @ApiResponse({ type: VersionRead })
    async deleteVersion(
        @Param('productId') productId: string,
        @Param('versionId') versionId: string
    ): Promise<VersionRead> {
        await canDeleteVersionOrFail(this.request.user && this.request.user.userId, productId, versionId)
        return this.versionService.deleteVersion(productId, versionId)
    }
}