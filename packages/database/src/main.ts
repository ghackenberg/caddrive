import 'reflect-metadata'
import { DataSource, DataSourceOptions, FindOptionsWhere, Repository } from 'typeorm'

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

export class Database {
    private static instance: Database

    static async init() {
        if (!this.instance) {
            const type = process.env['TYPEORM_TYPE']

            if (type == 'postgres') {
                const host = process.env['TYPEORM_HOST']
                const port = parseInt(process.env['TYPEORM_PORT'])
                const database = process.env['TYPEORM_DATABASE']
                const username = process.env['TYPEORM_USERNAME']
                const password = process.env['TYPEORM_PASSWORD']

                this.instance  = new Database({
                    type,
                    host,
                    port,
                    database,
                    username,
                    password,
                    synchronize: true,
                    logging: false,
                    entities: [UserEntity, ProductEntity, MemberEntity, VersionEntity, IssueEntity, CommentEntity, MilestoneEntity],
                    subscribers: [],
                    migrations: []
                })
            } else if (type == 'sqlite') {
                const database = process.env['TYPEORM_DATABASE']

                this.instance  = new Database({
                    type,
                    database,
                    synchronize: true,
                    logging: false,
                    entities: [UserEntity, ProductEntity, MemberEntity, VersionEntity, IssueEntity, CommentEntity, MilestoneEntity],
                    subscribers: [],
                    migrations: []
                })
            } else {
                throw 'Database type not supported'
            }
            await this.instance.dataSource.initialize()
        } else {
            throw 'Already initialized'
        }
    }

    static get() {
        return this.instance
    }

    public readonly dataSource: DataSource

    public readonly userRepository: Repository<UserEntity>
    public readonly productRepository: Repository<ProductEntity>
    public readonly memberRepository: Repository<MemberEntity>
    public readonly versionRepository: Repository<VersionEntity>
    public readonly issueRepository: Repository<IssueEntity>
    public readonly commentRepository: Repository<CommentEntity>
    public readonly milestoneRepository: Repository<MilestoneEntity>

    private constructor(options: DataSourceOptions) {
        this.dataSource = new DataSource(options)

        this.userRepository = this.dataSource.getRepository(UserEntity)
        this.productRepository = this.dataSource.getRepository(ProductEntity)
        this.memberRepository = this.dataSource.getRepository(MemberEntity)
        this.versionRepository = this.dataSource.getRepository(VersionEntity)
        this.issueRepository = this.dataSource.getRepository(IssueEntity)
        this.commentRepository = this.dataSource.getRepository(CommentEntity)
        this.milestoneRepository = this.dataSource.getRepository(MilestoneEntity)
    }
}

async function getEntityOrFail<T, E>(repository: Repository<T>, where: FindOptionsWhere<T>, ErrorType: { new(): E }) {
    try {
        return await repository.findOneByOrFail(where)
    } catch (error) {
        throw new ErrorType()
    }
}

export async function getUserOrFail<E>(where: FindOptionsWhere<UserEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().userRepository, where, ErrorType)
}
export async function getProductOrFail<E>(where: FindOptionsWhere<ProductEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().productRepository, where, ErrorType)
}
export async function getMemberOrFail<E>(where: FindOptionsWhere<MemberEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().memberRepository, where, ErrorType)
}
export async function getVersionOrFail<E>(where: FindOptionsWhere<VersionEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().versionRepository, where, ErrorType)
}
export async function getMilestoneOrFail<E>(where: FindOptionsWhere<MilestoneEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().milestoneRepository, where, ErrorType)
}
export async function getIssueOrFail<E>(where: FindOptionsWhere<IssueEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().issueRepository, where, ErrorType)
}
export async function getCommentOrFail<E>(where: FindOptionsWhere<CommentEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().commentRepository, where, ErrorType)
}