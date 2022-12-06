import { Module } from '@nestjs/common'

import { MilestoneController } from './milestone.controller'
import { MilestoneService } from './milestone.service'

@Module({
    controllers: [MilestoneController],
    providers: [MilestoneService]
})
export class MilestoneModule {

}