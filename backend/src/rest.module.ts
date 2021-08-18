import { Module } from '@nestjs/common'
import { AuditModule } from './rest/audits/audit.module'
import { ProductModule } from './rest/products/product.module'
import { UserModule } from './rest/users/user.module'
import { VersionModule } from './rest/versions/version.module'

@Module({
    imports: [UserModule, ProductModule, AuditModule, VersionModule]
})
export class RESTModule {

}