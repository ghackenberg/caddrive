import { Module } from '@nestjs/common'
import { MemberModule } from '../members/member.module'
import { MilestoneController } from './milestone.controller'
import { MilestoneService } from './milestone.service'

@Module({
    controllers: [MilestoneController],
    providers: [MilestoneService],
    imports: [MemberModule],
    exports: [MilestoneService]
})
export class MilestoneModule {}