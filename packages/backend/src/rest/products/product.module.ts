import { Module } from '@nestjs/common'
import { IssueModule } from '../issues/issue.module'
import { MemberModule } from '../members/member.module'
import { VersionModule } from '../versions/version.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [VersionModule, IssueModule, MemberModule],
    exports: [ProductService]
})
export class ProductModule {}