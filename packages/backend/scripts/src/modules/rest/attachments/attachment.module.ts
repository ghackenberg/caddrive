import { Module } from '@nestjs/common'
import { AttachmentController } from './attachment.controller.js'
import { AttachmentService } from './attachment.service.js'

@Module({
    controllers: [AttachmentController],
    providers: [AttachmentService]
})
export class AttachmentModule {}