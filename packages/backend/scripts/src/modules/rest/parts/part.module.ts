import { Module } from '@nestjs/common'
import { PartController } from './part.controller.js'
import { PartService } from './part.service.js'

@Module({
    controllers: [PartController],
    providers: [PartService]
})
export class PartModule {}