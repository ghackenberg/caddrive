import { forwardRef, Module } from '@nestjs/common'
import { AuditModule } from '../audits/audit.module'
import { ProductModule } from '../products/product.module'
import { UserModule } from '../users/user.module'
import { VersionModule } from '../versions/version.module'
import { EventController } from './event.controller'
import { EventService } from './event.service'

@Module({
    controllers: [EventController],
    providers: [EventService],
    imports: [forwardRef(() => AuditModule), forwardRef(() => VersionModule), forwardRef(() => ProductModule), forwardRef(() => UserModule)],
    exports: [EventService]
})
export class EventModule {}