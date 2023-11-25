import { Module } from '@nestjs/common'

import { AttachmentController } from './attachment.controller'
import { AttachmentService } from './attachment.service'

@Module({
    controllers: [AttachmentController],
    providers: [AttachmentService]
})
export class AttachmentModule {}