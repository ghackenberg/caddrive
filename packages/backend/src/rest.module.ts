import { Module } from '@nestjs/common'
import { ProductModule } from './rest/products/product.module'
import { UserModule } from './rest/users/user.module'
import { VersionModule } from './rest/versions/version.module'
import { ModelModule } from './rest/models/model.module'
import { IssueModule } from './rest/issues/issue.module'
import { CommentModule } from './rest/comments/comment.module'

@Module({
    imports: [UserModule, ProductModule, VersionModule, IssueModule, CommentModule, ModelModule]
})
export class RESTModule {}