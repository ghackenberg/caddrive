import { Module } from '@nestjs/common'
import { VersionModule } from '../versions/version.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [VersionModule],
    exports: [ProductService]
})
export class ProductModule {}