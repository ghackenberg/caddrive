import { Module } from '@nestjs/common'
import { AuditModule } from './audits/audit.module'
import { ProductModule } from './products/product.module'
import { UserModule } from './users/user.module'

@Module({
    imports: [UserModule, ProductModule, AuditModule]
})
export class AppModule {

}