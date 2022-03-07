import { Module } from '@nestjs/common'
import { IssueModule } from '../issues/issue.module'
import { VersionModule } from '../versions/version.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [VersionModule, IssueModule],
    exports: [ProductService]
})
export class ProductModule {}