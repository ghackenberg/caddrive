import 'reflect-metadata'
import { DataSource, FindOptionsWhere, Repository } from 'typeorm'

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

async function getEntityOrFail<T, E>(repository: Repository<T>, where: FindOptionsWhere<T>, ErrorType: { new(): E }) {
    try {
        return await repository.findOneByOrFail(where)
    } catch (error) {
        throw new ErrorType()
    }
}

export async function getUserOrFail<E>(where: FindOptionsWhere<UserEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(UserRepository, where, ErrorType)
}
export async function getProductOrFail<E>(where: FindOptionsWhere<ProductEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(ProductRepository, where, ErrorType)
}
export async function getMemberOrFail<E>(where: FindOptionsWhere<MemberEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(MemberRepository, where, ErrorType)
}
export async function getVersionOrFail<E>(where: FindOptionsWhere<VersionEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(VersionRepository, where, ErrorType)
}
export async function getMilestoneOrFail<E>(where: FindOptionsWhere<MilestoneEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(MilestoneRepository, where, ErrorType)
}
export async function getIssueOrFail<E>(where: FindOptionsWhere<IssueEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(IssueRepository, where, ErrorType)
}
export async function getCommentOrFail<E>(where: FindOptionsWhere<CommentEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(CommentRepository, where, ErrorType)
}