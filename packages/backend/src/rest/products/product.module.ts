import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IssueModule } from '../issues/issue.module'
import { MemberModule } from '../members/member.module'
import { MilestoneModule } from '../milestones/milestone.module'
import { VersionModule } from '../versions/version.module'
import { ProductController } from './product.controller'
import { ProductEntity } from './product.entity'
import { ProductService } from './product.service'

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [VersionModule, IssueModule, MilestoneModule, MemberModule, TypeOrmModule.forFeature([ProductEntity])],
    exports: [ProductService]
})
export class ProductModule {}