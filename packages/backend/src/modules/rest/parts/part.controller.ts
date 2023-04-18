import { Controller, Get, Param, StreamableFile } from "@nestjs/common"

import { PartService } from "./part.service"

@Controller('rest/parts')
export class PartController {

    constructor(private readonly service: PartService) {
        // Empty
    }

    @Get(':name')
    async getPart(
        @Param('name') name: string
    ): Promise<StreamableFile> {
        return new StreamableFile(await this.service.getPart(name))
    }
}