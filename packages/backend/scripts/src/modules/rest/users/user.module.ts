import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}