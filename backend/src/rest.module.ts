import { Module } from '@nestjs/common'
import { AuditModule } from './rest/audits/audit.module'
import { ProductModule } from './rest/products/product.module'
import { UserModule } from './rest/users/user.module'

@Module({
    imports: [UserModule, ProductModule, AuditModule]
})
export class RESTModule {

}