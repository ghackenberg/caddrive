import { forwardRef, Module } from '@nestjs/common'
import { AuditModule } from '../audits/audit.module'
import { ProductModule } from '../products/product.module'
import { VersionController } from './version.controller'
import { VersionService } from './version.service'

@Module({
    controllers: [VersionController],
    providers: [VersionService],
    imports: [forwardRef(() => ProductModule), forwardRef(() => AuditModule)],
    exports: [VersionService]
})
export class VersionModule {}