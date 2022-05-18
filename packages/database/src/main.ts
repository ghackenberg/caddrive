import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { CommentEntity } from './entities/comment'
import { IssueEntity } from './entities/issue'
import { MemberEntity } from './entities/member'
import { MilestoneEntity } from './entities/milestone'
import { ProductEntity } from './entities/product'
import { UserEntity } from './entities/user'
import { VersionEntity } from './entities/version'

export { CommentEntity } from './entities/comment'
export { IssueEntity } from './entities/issue'
export { MemberEntity } from './entities/member'
export { MilestoneEntity } from './entities/milestone'
export { ProductEntity } from './entities/product'
export { UserEntity } from './entities/user'
export { VersionEntity } from './entities/version'

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "postgres",
    username: "postgres",
    password: "test",
    synchronize: true,
    logging: false,
    entities: [UserEntity, ProductEntity, MemberEntity, VersionEntity, IssueEntity, CommentEntity, MilestoneEntity],
    subscribers: [],
    migrations: [],
})

export const UserRepository = AppDataSource.getRepository(UserEntity)
export const ProductRepository = AppDataSource.getRepository(ProductEntity)
export const MemberRepository = AppDataSource.getRepository(MemberEntity)
export const VersionRepository = AppDataSource.getRepository(VersionEntity)
export const IssueRepository = AppDataSource.getRepository(IssueEntity)
export const CommentRepository = AppDataSource.getRepository(CommentEntity)
export const MilestoneRepository = AppDataSource.getRepository(MilestoneEntity)