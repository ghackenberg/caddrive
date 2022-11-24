import { Module } from '@nestjs/common'

import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

@Module({
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentModule {}