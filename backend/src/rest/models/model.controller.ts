import { Controller, Get, Param, StreamableFile } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'
import { ModelService } from './model.service'

@Controller('rest/models')
export class ModelController {
    constructor(private modelService: ModelService) {

    }


    @Get(':id')
    @ApiParam({ name: 'id' })
    async getModel(@Param('id') id: string): Promise<StreamableFile> {

        return new StreamableFile(await this.modelService.getModel(id))

    }

}