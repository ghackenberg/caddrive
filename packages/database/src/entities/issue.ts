import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { Issue } from 'productboard-common'

import { CommentEntity } from './comment'
import { MilestoneEntity } from './milestone'
import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class IssueEntity extends Issue {
    @Column({ nullable: false })
    override productId: string
    @PrimaryColumn({ nullable: false })
    override issueId: string
    @Column({nullable: false})
    override userId: string
    @Column({nullable: true})
    override milestoneId: string
    @Column({ nullable: true })
    override audioId: string
    @Column('simple-array')
    override assignedUserIds: string[]

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity
    @ManyToOne(() => MilestoneEntity)
    @JoinColumn({ name: 'milestoneId' })
    milestone: MilestoneEntity

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: false, default: 0 })
    override updated: number
    @Column({ nullable: true })
    override deleted: number

    @Column({nullable: false})
    override label: string
    @Column({nullable: false})
    override text: string
    @Column({nullable: false, default: 'open'})
    override state: 'open' | 'closed'

    @OneToMany(() => CommentEntity, comment => comment.issue)
    comments: CommentEntity[]
}