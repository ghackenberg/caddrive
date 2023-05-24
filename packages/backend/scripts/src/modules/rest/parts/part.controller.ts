import { Controller, Get, Header, Param, StreamableFile } from "@nestjs/common"

import { PartService } from "./part.service"

@Controller('rest/parts')
export class PartController {
    constructor(private readonly service: PartService) {}

    @Get(':name')
    @Header('Cache-Control', 'max-age=31536000')
    async getPart(
        @Param('name') name: string
    ): Promise<StreamableFile> {
        return new StreamableFile(await this.service.getPart(name))
    }
}