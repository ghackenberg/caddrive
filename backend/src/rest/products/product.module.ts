import { forwardRef, Module } from '@nestjs/common'
import { AuditModule } from '../audits/audit.module'
import { VersionModule } from '../versions/version.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [forwardRef(() => VersionModule), forwardRef(() => AuditModule)],
    exports: [ProductService]
})
export class ProductModule {

}