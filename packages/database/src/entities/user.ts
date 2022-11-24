import { User } from 'productboard-common'
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import { CommentEntity } from './comment'
import { IssueEntity } from './issue'
import { MemberEntity } from './member'
import { MilestoneEntity } from './milestone'
import { ProductEntity } from './product'
import { VersionEntity } from './version'

@Entity()
export class UserEntity extends User {
    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({ nullable: false, unique: true })
    override email: string

    @Column({ nullable: false })
    override name: string

    @Column({ nullable: false })
    override password: string

    @Column({ nullable: false })
    override pictureId: string

    @Column({ nullable: false })
    override userManagementPermission: boolean

    @Column({ nullable: false })
    override productManagementPermission: boolean

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