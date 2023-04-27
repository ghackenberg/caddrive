import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import { User } from 'productboard-common'

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

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: true })
    override updated: number
    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: false, unique: false })
    override email: string
    @Column({ nullable: true })
    override consent: boolean
    @Column({ nullable: true })
    override name: string

    @Column({ nullable: true })
    override pictureId: string

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