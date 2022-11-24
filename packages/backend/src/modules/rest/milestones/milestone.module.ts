import { Module } from '@nestjs/common'

import { MilestoneController } from './milestone.controller'
import { MilestoneService } from './milestone.service'

@Module({
    controllers: [MilestoneController],
    providers: [MilestoneService],
    exports: [MilestoneService]
})
export class MilestoneModule {}