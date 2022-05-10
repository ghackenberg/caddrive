import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductModule } from './rest/products/product.module'
import { UserModule } from './rest/users/user.module'
import { VersionModule } from './rest/versions/version.module'
import { FileModule } from './rest/files/file.module'
import { IssueModule } from './rest/issues/issue.module'
import { CommentModule } from './rest/comments/comment.module'
import { MemberModule } from './rest/members/member.module'
import { MilestoneModule } from './rest/milestones/milestone.module'
import { UserEntity } from './rest/users/user.entity'
import { ProductEntity } from './rest/products/product.entity'
import { VersionEntity } from './rest/versions/version.entity'
import { MemberEntity } from './rest/members/member.entity'
import { IssueEntity } from './rest/issues/issue.entity'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'postgres',
            username: 'postgres',
            password: 'test',
            entities: [UserEntity, ProductEntity, VersionEntity, MemberEntity, IssueEntity],
            synchronize: true,
            logging: true,
        }),
        UserModule, ProductModule, VersionModule, IssueModule, CommentModule, FileModule, MilestoneModule, MemberModule
    ]
})
export class RESTModule {}