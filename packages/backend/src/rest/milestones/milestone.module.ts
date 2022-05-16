import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IssueEntity } from '../issues/issue.entity'
import { MemberModule } from '../members/member.module'
import { MilestoneController } from './milestone.controller'
import { MilestoneEntity } from './milestone.entity'
import { MilestoneService } from './milestone.service'

@Module({
    controllers: [MilestoneController],
    providers: [MilestoneService],
    imports: [MemberModule, TypeOrmModule.forFeature([MilestoneEntity]), TypeOrmModule.forFeature([IssueEntity])],
    exports: [MilestoneService]
})
export class MilestoneModule {}