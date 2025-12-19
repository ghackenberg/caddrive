import 'reflect-metadata'
import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
import options from './config.js'
import { AttachmentEntity } from './entities/attachment.js'
import { CommentEntity } from './entities/comment.js'
import { IssueEntity } from './entities/issue.js'
import { MemberEntity } from './entities/member.js'
import { MilestoneEntity } from './entities/milestone.js'
import { ProductEntity } from './entities/product.js'
import { TokenEntity } from './entities/token.js'
import { UserEntity } from './entities/user.js'
import { VersionEntity } from './entities/version.js'

export * from './compile.js'
export * from './convert.js'
export { AttachmentEntity } from './entities/attachment.js'
export { CommentEntity } from './entities/comment.js'
export { IssueEntity } from './entities/issue.js'
export { MemberEntity } from './entities/member.js'
export { MilestoneEntity } from './entities/milestone.js'
export { ProductEntity } from './entities/product.js'
export { TokenEntity } from './entities/token.js'
export { UserEntity } from './entities/user.js'
export { VersionEntity } from './entities/version.js'

export class Database {
    private static instance: Database

    static async init() {
        if (!this.instance) {
            if (options) {
                this.instance = new Database(options)
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

    public readonly tokenRepository: Repository<TokenEntity>
    public readonly userRepository: Repository<UserEntity>
    public readonly productRepository: Repository<ProductEntity>
    public readonly memberRepository: Repository<MemberEntity>
    public readonly versionRepository: Repository<VersionEntity>
    public readonly issueRepository: Repository<IssueEntity>
    public readonly commentRepository: Repository<CommentEntity>
    public readonly attachmentRepository: Repository<AttachmentEntity>
    public readonly milestoneRepository: Repository<MilestoneEntity>

    private constructor(config: DataSource) {
        this.dataSource = config

        this.tokenRepository = this.dataSource.getRepository(TokenEntity)
        this.userRepository = this.dataSource.getRepository(UserEntity)
        this.productRepository = this.dataSource.getRepository(ProductEntity)
        this.memberRepository = this.dataSource.getRepository(MemberEntity)
        this.versionRepository = this.dataSource.getRepository(VersionEntity)
        this.issueRepository = this.dataSource.getRepository(IssueEntity)
        this.commentRepository = this.dataSource.getRepository(CommentEntity)
        this.attachmentRepository = this.dataSource.getRepository(AttachmentEntity)
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

export async function getTokenOrFail<E>(where: FindOptionsWhere<TokenEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().tokenRepository, where, ErrorType)
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
export async function getAttachmentOrFail<E>(where: FindOptionsWhere<AttachmentEntity>, ErrorType: { new(): E }) {
    return getEntityOrFail(Database.get().attachmentRepository, where, ErrorType)
}