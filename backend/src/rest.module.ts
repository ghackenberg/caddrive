import { Module } from '@nestjs/common'
import { AuditModule } from './rest/audits/audit.module'
import { ProductModule } from './rest/products/product.module'
import { UserModule } from './rest/users/user.module'
import { VersionModule } from './rest/versions/version.module'
import { MemoModule } from './rest/memos/memo.module'

@Module({
    imports: [AuditModule, MemoModule, ProductModule, UserModule, VersionModule]
})
export class RESTModule {

}