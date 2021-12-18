import { Controller, Get, Param, StreamableFile } from '@nestjs/common'
import { ApiParam, ApiResponse } from '@nestjs/swagger'
import { ModelService } from './model.service'

@Controller('rest/models')
// TODO: use auth!
//@UseGuards(AuthGuard('basic'))
//@ApiBasicAuth()
export class ModelController {
    constructor(
        private readonly modelService: ModelService
    ) {}

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: StreamableFile })
    async getModel(
        @Param('id') id: string
    ): Promise<StreamableFile> {
        return new StreamableFile(await this.modelService.getModel(id))
    }
}