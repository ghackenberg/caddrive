import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IssueModule } from '../issues/issue.module'
import { MemberModule } from '../members/member.module'
import { CommentController } from './comment.controller'
import { CommentEntity } from './comment.entity'
import { CommentService } from './comment.service'


@Module({
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService],
    imports: [forwardRef(() => IssueModule),MemberModule, TypeOrmModule.forFeature([CommentEntity])],
})
export class CommentModule {}