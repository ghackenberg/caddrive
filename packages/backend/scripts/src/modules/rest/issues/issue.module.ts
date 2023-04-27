import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { IssueController } from './issue.controller'
import { IssueService } from './issue.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [IssueController],
    providers: [IssueService]
})
export class IssueModule {}