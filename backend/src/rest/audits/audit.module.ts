import { forwardRef, Module } from '@nestjs/common'
import { EventModule } from '../events/event.module'
import { ProductModule } from '../products/product.module'
import { VersionModule } from '../versions/version.module'
import { AuditController } from './audit.controller'
import { AuditService } from './audit.service'

@Module({
    controllers: [AuditController],
    providers: [AuditService],
    exports: [AuditService],
    imports: [forwardRef(() => ProductModule), forwardRef(() => VersionModule), forwardRef(() => EventModule)]
})
export class AuditModule {}