import { Controller, Get, Inject, Param, StreamableFile } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiParam, ApiResponse } from '@nestjs/swagger'
import { Request } from 'express'
import { FileREST, User } from 'productboard-common'
import { canReadFileOrFail } from '../../permission'
import { FileService } from './file.service'

@Controller('rest/files')
//@UseGuards(AuthGuard('basic'))
//@ApiBasicAuth()
export class FileController implements FileREST<StreamableFile> {
    constructor(
        private readonly fileService: FileService,
        @Inject(REQUEST)
        private readonly request: Request
    ) {}

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: StreamableFile })
    async getFile(
        @Param('id') id: string
    ): Promise<StreamableFile> {
        canReadFileOrFail((<User> this.request.user).id, id)
        return new StreamableFile(await this.fileService.getFile(id))
    }
}