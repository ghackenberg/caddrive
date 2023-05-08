import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { TagController } from './tag.controller'
import { TagService } from './tag.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService],
})
export class TagModule {}