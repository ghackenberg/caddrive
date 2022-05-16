import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentEntity } from '../comments/comment.entity'
import { MemberModule } from '../members/member.module'
import { IssueController } from './issue.controller'
import { IssueEntity } from './issue.entity'
import { IssueService } from './issue.service'

@Module({
    controllers: [IssueController],
    providers: [IssueService],
    exports: [IssueService],
    imports: [MemberModule, TypeOrmModule.forFeature([IssueEntity]), TypeOrmModule.forFeature([CommentEntity])]
})
export class IssueModule {}