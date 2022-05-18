import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { CommentEntity } from './comment'
import { IssueEntity } from './issue'
import { MemberEntity } from './member'
import { MilestoneEntity } from './milestone'
import { ProductEntity } from './product'
import { VersionEntity } from './version'

@Entity()
export class UserEntity {
    @PrimaryColumn({ nullable: false })
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
    
    @OneToMany(() => MemberEntity, member => member.user)
    members: MemberEntity[]

    @OneToMany(() => VersionEntity, version => version.user)
    versions: VersionEntity[]

    @OneToMany(() => MilestoneEntity, milestone => milestone.user)
    milestones: MilestoneEntity[]

    @OneToMany(() => IssueEntity, issue => issue.user)
    issues: IssueEntity[]

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[]
}