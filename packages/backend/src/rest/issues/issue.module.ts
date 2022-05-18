import { Module } from '@nestjs/common'
import { MemberModule } from '../members/member.module'
import { IssueController } from './issue.controller'
import { IssueService } from './issue.service'

@Module({
    controllers: [IssueController],
    providers: [IssueService],
    exports: [IssueService],
    imports: [MemberModule]
})
export class IssueModule {}