import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { VersionController } from './version.controller'
import { VersionService } from './version.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [VersionController],
    providers: [VersionService],
    exports: [VersionService]
})
export class VersionModule {}