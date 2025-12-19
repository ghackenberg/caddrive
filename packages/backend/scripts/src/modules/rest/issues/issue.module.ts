import { Module } from '@nestjs/common'
import { IssueController } from './issue.controller.js'
import { IssueService } from './issue.service.js'

@Module({
    controllers: [IssueController],
    providers: [IssueService]
})
export class IssueModule {}