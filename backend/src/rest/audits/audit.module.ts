import { Module } from '@nestjs/common'
import { ProductModule } from '../products/product.module'
import { VersionModule } from '../versions/version.module'
import { AuditController } from './audit.controller'
import { AuditService } from './audit.service'

@Module({
    controllers: [AuditController],
    providers: [AuditService],
    exports: [AuditService],
    imports: [ProductModule, VersionModule]
})
export class AuditModule {

}