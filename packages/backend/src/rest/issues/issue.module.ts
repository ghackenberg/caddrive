import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentModule } from '../comments/comment.module'
import { MemberModule } from '../members/member.module'
import { MilestoneModule } from '../milestones/milestone.module'
import { IssueController } from './issue.controller'
import { IssueEntity } from './issue.entity'
import { IssueService } from './issue.service'

@Module({
    controllers: [IssueController],
    providers: [IssueService],
    exports: [IssueService],
    imports: [CommentModule, MemberModule, forwardRef(() => MilestoneModule), TypeOrmModule.forFeature([IssueEntity])]
})
export class IssueModule {}