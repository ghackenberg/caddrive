import { Controller, Get, Param, StreamableFile, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiParam, ApiResponse } from '@nestjs/swagger'
import { FileREST } from 'productboard-common'
import { FileService } from './file.service'

@Controller('rest/files')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class FileController implements FileREST<StreamableFile> {
    constructor(
        private readonly fileService: FileService
    ) {}

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: StreamableFile })
    async getFile(
        @Param('id') id: string
    ): Promise<StreamableFile> {
        return new StreamableFile(await this.fileService.getFile(id))
    }
}