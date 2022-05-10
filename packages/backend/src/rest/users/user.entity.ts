import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { CommentEntity } from '../comments/comment.entity'
import { IssueEntity } from '../issues/issue.entity'
import { MemberEntity } from '../members/member.entity'
import { MilestoneEntity } from '../milestones/milestone.entity'
import { ProductEntity } from '../products/product.entity'
import { VersionEntity } from '../versions/version.entity'

@Entity()
export class UserEntity {
    @PrimaryColumn()
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @Column({ nullable: false, unique: true })
    email: string

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false })
    pictureId: string

    @OneToMany(() => ProductEntity, product => product.user)
    products: ProductEntity[]

    @OneToMany(() => MilestoneEntity, milestone => milestone.user)
    milestones: MilestoneEntity[]

    @OneToMany(() => VersionEntity, version => version.user)
    versions: VersionEntity[]

    @OneToMany(() => IssueEntity, issue => issue.user)
    issues: IssueEntity[]

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[]

    @OneToMany(() => MemberEntity, member => member.user)
    member: MemberEntity[]





}