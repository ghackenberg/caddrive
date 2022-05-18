import { Module } from '@nestjs/common'
import { ProductModule } from './rest/products/product.module'
import { UserModule } from './rest/users/user.module'
import { VersionModule } from './rest/versions/version.module'
import { FileModule } from './rest/files/file.module'
import { IssueModule } from './rest/issues/issue.module'
import { CommentModule } from './rest/comments/comment.module'
import { MemberModule } from './rest/members/member.module'
import { MilestoneModule } from './rest/milestones/milestone.module'

@Module({
    imports: [UserModule, ProductModule, VersionModule, IssueModule, CommentModule, FileModule, MilestoneModule, MemberModule]
})
export class RESTModule {}