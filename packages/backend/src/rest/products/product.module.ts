import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IssueEntity } from '../issues/issue.entity'
import { MemberEntity } from '../members/member.entity'
import { MemberModule } from '../members/member.module'
import { MilestoneEntity } from '../milestones/milestone.entity'
import { VersionEntity } from '../versions/version.entity'
import { ProductController } from './product.controller'
import { ProductEntity } from './product.entity'
import { ProductService } from './product.service'

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [MemberModule, TypeOrmModule.forFeature([ProductEntity]), TypeOrmModule.forFeature([MemberEntity]), TypeOrmModule.forFeature([VersionEntity]),TypeOrmModule.forFeature([IssueEntity]), TypeOrmModule.forFeature([MilestoneEntity])],
    exports: [ProductService]
})
export class ProductModule {}