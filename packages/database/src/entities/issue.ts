import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { Issue } from 'productboard-common'

import { CommentEntity } from './comment'
import { MilestoneEntity } from './milestone'
import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class IssueEntity extends Issue {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({ nullable: true })
    override audioId: string

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({nullable: false})
    override userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity

    @Column({ nullable: false })
    override productId: string

    @ManyToOne(() => MilestoneEntity)
    @JoinColumn({ name: 'milestoneId' })
    milestone: MilestoneEntity

    @Column({nullable: true})
    override milestoneId: string

    @Column('simple-array')
    override assigneeIds: string[]

    @Column({ nullable: false })
    override creationDate: string

    @Column({nullable: false})
    override name: string

    @Column({nullable: false})
    override description: string

    @Column({nullable: false, default: 'open'})
    override state: 'open' | 'closed'

    @OneToMany(() => CommentEntity, comment => comment.issue)
    comments: CommentEntity[]

    @Column({ nullable: true })
    override parentIssueId: string

    @Column({ nullable: false })
    override stateId: string

    @Column({ nullable: false })
    override issueTypeId: string

    @Column({ nullable: false })
    override modificationDate: string

    @Column({ nullable: false })
    override priority: string

    @Column({ nullable: true })
    override storypoints: number

    @Column({ nullable: true })
    override progress: number
}