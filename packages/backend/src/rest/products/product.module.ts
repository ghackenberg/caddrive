import { Module } from '@nestjs/common'
import { MemberModule } from '../members/member.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [MemberModule],
    exports: [ProductService]
})
export class ProductModule {}