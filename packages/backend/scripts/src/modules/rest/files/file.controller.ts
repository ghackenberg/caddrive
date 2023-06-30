import { Controller, Get, Header, Inject, Param, StreamableFile, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger'

import { FileREST } from 'productboard-common'

import { FileService } from './file.service'
import { canReadFileOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/files')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class FileController implements FileREST<StreamableFile> {
    constructor(
        private readonly fileService: FileService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get(':id')
    @Header('Cache-Control', 'max-age=31536000')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: StreamableFile })
    async getFile(
        @Param('id') id: string
    ): Promise<StreamableFile> {
        await canReadFileOrFail(this.request.user, id)
        return new StreamableFile(await this.fileService.getFile(id))
    }
}