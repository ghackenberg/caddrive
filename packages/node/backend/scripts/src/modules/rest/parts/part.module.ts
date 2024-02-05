import { Module } from '@nestjs/common'

import { PartController } from './part.controller'
import { PartService } from './part.service'

@Module({
    controllers: [PartController],
    providers: [PartService]
})
export class PartModule {}