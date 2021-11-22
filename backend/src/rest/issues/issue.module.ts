import { Module } from '@nestjs/common'
import { CommentModule } from '../comments/comment.module'
import { IssueController } from './issue.controller'
import { IssueService } from './issue.service'

@Module({
    controllers: [IssueController],
    providers: [IssueService],
    exports: [IssueService],
    imports: [CommentModule]
})
export class IssueModule {}