import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { TagAssignmentController } from './tagAssignment.controller'
import { TagAssignmentService } from './tagAssignment.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [TagAssignmentController],
    providers: [TagAssignmentService],
    exports: [TagAssignmentService],
})
export class TagAssignmentModule {}