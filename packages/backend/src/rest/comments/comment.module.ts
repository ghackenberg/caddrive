import { forwardRef, Module } from '@nestjs/common'
import { IssueModule } from '../issues/issue.module'
import { MemberModule } from '../members/member.module'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'


@Module({
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService],
    imports: [forwardRef(() => IssueModule),MemberModule],
})
export class CommentModule {}