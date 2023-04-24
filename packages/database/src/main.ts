import 'reflect-metadata'
import { DataSource, DataSourceOptions, FindOptionsWhere, Repository } from 'typeorm'

import { ActionEntity } from './entities/action'
import { AdditionalPropertyEntity } from './entities/additonalProperty'
import { AttachmentEntity } from './entities/attachment'
import { CommentEntity } from './entities/comment'
import { DoneCriterionEntity } from './entities/doneCriterion'
import { DonePropertyEntity } from './entities/doneProperty'
import { GuardEntity } from './entities/guard'
import { IssueEntity } from './entities/issue'
import { IssueTypeEntity } from './entities/issueType'
import { IssueTypeHierarchyEntity } from './entities/issueTypeHierarchy'
import { MemberEntity } from './entities/member'
import { MilestoneEntity } from './entities/milestone'
import { ProductEntity } from './entities/product'
import { PropertyEntity } from './entities/property'
import { PropertyTypeEntity } from './entities/propertyType'
import { ReadyCriterionEntity } from './entities/readyCriterion'
import { ReadyPropertyEntity } from './entities/readyProperty'
import { RelationEntity } from './entities/relation'
import { StateEntity } from './entities/state'
import { TagEntity } from './entities/tag'
import { TagAssignmentEntity } from './entities/tagAssignment'
import { TransitionEntity } from './entities/transition'
import { UserEntity } from './entities/user'
import { VersionEntity } from './entities/version'

export { ActionEntity } from './entities/action'
export { AdditionalPropertyEntity } from './entities/additonalProperty'
export { AttachmentEntity } from './entities/attachment'
export { CommentEntity } from './entities/comment'
export { DoneCriterionEntity } from './entities/doneCriterion'
export { DonePropertyEntity } from './entities/doneProperty'
export { GuardEntity } from './entities/guard'
export { IssueEntity } from './entities/issue'
export { IssueTypeEntity } from './entities/issueType'
export { IssueTypeHierarchyEntity } from './entities/issueTypeHierarchy'
export { MemberEntity } from './entities/member'
export { MilestoneEntity } from './entities/milestone'
export { ProductEntity } from './entities/product'
export { PropertyEntity } from './entities/property'
export { PropertyTypeEntity } from './entities/propertyType'
export { ReadyCriterionEntity } from './entities/readyCriterion'
export { ReadyPropertyEntity } from './entities/readyProperty'
export { RelationEntity } from './entities/relation'
export { StateEntity } from './entities/state'
export { TagEntity } from './entities/tag'
export { TagAssignmentEntity } from './entities/tagAssignment'
export { TransitionEntity } from './entities/transition'
export { UserEntity } from './entities/user'
export { VersionEntity } from './entities/version'

export class Database {
    private static instance: Database

    static async init() {
        if (!this.instance) {
            const type = process.env['TYPEORM_TYPE'] || 'sqlite'

            if (type == 'postgres') {
                const host = process.env['TYPEORM_HOST'] || 'localhost'
                const port = parseInt(process.env['TYPEORM_PORT'] || '5432')
                const database = process.env['TYPEORM_DATABASE'] || 'postgres'
                const username = process.env['TYPEORM_USERNAME'] || 'postgres'
                const password = process.env['TYPEORM_PASSWORD'] || 'test'

                this.instance = new Database({
                    type,
                    host,
                    port,
                    database,
                    username,
                    password,
                    synchronize: true,
                    logging: false,
                    entities: [
                        ActionEntity,
                        AdditionalPropertyEntity,
                        AttachmentEntity,
                        CommentEntity,
                        DoneCriterionEntity,
                        DonePropertyEntity,
                        GuardEntity,
                        IssueEntity,
                        IssueTypeEntity,
                        IssueTypeHierarchyEntity,
                        MemberEntity,
                        MilestoneEntity,
                        ProductEntity,
                        PropertyEntity,
                        PropertyTypeEntity,
                        ReadyCriterionEntity,
                        ReadyPropertyEntity,
                        RelationEntity,
                        StateEntity,
                        TagEntity,
                        TagAssignmentEntity,
                        TransitionEntity,
                        UserEntity,
                        VersionEntity
                    ],
                    subscribers: [],
                    migrations: []
                })
            } else if (type == 'sqlite') {
                const database = process.env['TYPEORM_DATABASE'] || '../../database.sqlite'

                this.instance = new Database({
                    type,
                    database,
                    synchronize: true,
                    logging: false,
                    entities: [
                        ActionEntity,
                        AdditionalPropertyEntity,
                        AttachmentEntity,
                        CommentEntity,
                        DoneCriterionEntity,
                        DonePropertyEntity,
                        GuardEntity,
                        IssueEntity,
                        IssueTypeEntity,
                        IssueTypeHierarchyEntity,
                        MemberEntity,
                        MilestoneEntity,
                        ProductEntity,
                        PropertyEntity,
                        PropertyTypeEntity,
                        ReadyCriterionEntity,
                        ReadyPropertyEntity,
                        RelationEntity,
                        StateEntity,
                        TagEntity,
                        TagAssignmentEntity,
                        TransitionEntity,
                        UserEntity,
                        VersionEntity
                    ],
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
    public readonly tagRepository: Repository<TagEntity>

    private constructor(options: DataSourceOptions) {
        this.dataSource = new DataSource(options)

        this.userRepository = this.dataSource.getRepository(UserEntity)
        this.productRepository = this.dataSource.getRepository(ProductEntity)
        this.memberRepository = this.dataSource.getRepository(MemberEntity)
        this.versionRepository = this.dataSource.getRepository(VersionEntity)
        this.issueRepository = this.dataSource.getRepository(IssueEntity)
        this.commentRepository = this.dataSource.getRepository(CommentEntity)
        this.milestoneRepository = this.dataSource.getRepository(MilestoneEntity)
        this.tagRepository = this.dataSource.getRepository(TagEntity)
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