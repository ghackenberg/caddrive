import { Module } from '@nestjs/common'
import { AuditModule } from './rest/audits/audit.module'
import { ProductModule } from './rest/products/product.module'
import { UserModule } from './rest/users/user.module'
import { VersionModule } from './rest/versions/version.module'
import { EventModule } from './rest/events/event.module'
import { ModelModule } from './rest/models/model.module'

@Module({
    imports: [UserModule, ProductModule, VersionModule, AuditModule, EventModule, ModelModule]
})
export class RESTModule {}