import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IssueModule } from '../issues/issue.module'
import { MemberModule } from '../members/member.module'
import { MilestoneController } from './milestone.controller'
import { MilestoneEntity } from './milestone.entity'
import { MilestoneService } from './milestone.service'

@Module({
    controllers: [MilestoneController],
    providers: [MilestoneService],
    imports: [MemberModule, forwardRef(() => IssueModule), TypeOrmModule.forFeature([MilestoneEntity])],
    exports: [MilestoneService]
})
export class MilestoneModule {}