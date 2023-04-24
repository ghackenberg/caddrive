import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentModule {}