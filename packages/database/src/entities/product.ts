import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { IssueEntity } from './issue'
import { MemberEntity } from './member'
import { MilestoneEntity } from './milestone'
import { UserEntity } from './user'
import { VersionEntity } from './version'

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
    members: MemberEntity[]

    @OneToMany(() => MilestoneEntity, milestone => milestone.product)
    milestones: MilestoneEntity[]

    @OneToMany(() => IssueEntity, issue => issue.product)
    issues: IssueEntity[]
}