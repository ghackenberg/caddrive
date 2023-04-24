import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { MilestoneController } from './milestone.controller'
import { MilestoneService } from './milestone.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [MilestoneController],
    providers: [MilestoneService],
    exports: [MilestoneService]
})
export class MilestoneModule {}