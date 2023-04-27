import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { MemberController } from './member.controller'
import { MemberService } from './member.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [MemberController],
    providers: [MemberService]
})
export class MemberModule {}