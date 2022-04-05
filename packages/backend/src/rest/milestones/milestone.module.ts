import { forwardRef, Module } from '@nestjs/common'
import { IssueModule } from '../issues/issue.module'
import { MemberModule } from '../members/member.module'
import { MilestoneController } from './milestone.controller'
import { MilestoneService } from './milestone.service'

@Module({
    controllers: [MilestoneController],
    providers: [MilestoneService],
    imports: [MemberModule, forwardRef(() => IssueModule)],
    exports: [MilestoneService]
})
export class MilestoneModule {}