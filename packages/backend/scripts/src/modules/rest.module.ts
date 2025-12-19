import { Module } from '@nestjs/common'
import { AttachmentModule } from './rest/attachments/attachment.module.js'
import { CommentModule } from './rest/comments/comment.module.js'
import { FileModule } from './rest/files/file.module.js'
import { IssueModule } from './rest/issues/issue.module.js'
import { KeyModule } from './rest/keys/key.module.js'
import { MemberModule } from './rest/members/member.module.js'
import { MilestoneModule } from './rest/milestones/milestone.module.js'
import { PartModule } from './rest/parts/part.module.js'
import { ProductModule } from './rest/products/product.module.js'
import { TokenModule } from './rest/tokens/token.module.js'
import { UserModule } from './rest/users/user.module.js'
import { VersionModule } from './rest/versions/version.module.js'

@Module({
    imports: [KeyModule, TokenModule, UserModule, PartModule, ProductModule, VersionModule, IssueModule, CommentModule, AttachmentModule, FileModule, MilestoneModule, MemberModule]
})
export class RESTModule {}