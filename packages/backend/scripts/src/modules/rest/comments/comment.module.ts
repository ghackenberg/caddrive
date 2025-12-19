import { Module } from '@nestjs/common'
import { CommentController } from './comment.controller.js'
import { CommentService } from './comment.service.js'

@Module({
    controllers: [CommentController],
    providers: [CommentService]
})
export class CommentModule {}