import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { IssueEntity } from '../issues/issue.entity'
import { MemberEntity } from '../members/member.entity'
import { MilestoneEntity } from '../milestones/milestone.entity'
import { UserEntity } from '../users/user.entity'
import { VersionEntity } from '../versions/version.entity'

@Entity()
export class ProductEntity {
    @PrimaryColumn({ nullable: false })
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    userId: string
    
    @Column({ nullable: false })
    name: string
    
    @Column({ nullable: false })
    description: string
    
    @OneToMany(() => VersionEntity, version => version.product)
    versions: VersionEntity[]

    @OneToMany(() => MemberEntity, member => member.product)
    member: MemberEntity[]

    @OneToMany(() => IssueEntity, issue => issue.product)
    issue: IssueEntity[]

    @OneToMany(() => MilestoneEntity, milestone => milestone.product)
    milestone: MilestoneEntity[]

}