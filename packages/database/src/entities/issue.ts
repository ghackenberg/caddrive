import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { CommentEntity } from './comment'
import { MilestoneEntity } from './milestone'
import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class IssueEntity {

    @PrimaryColumn({ nullable: false })
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({nullable: false})
    userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity

    @Column({ nullable: false })
    productId: string

    @ManyToOne(() => MilestoneEntity)
    @JoinColumn({ name: 'milestoneId' })
    milestone: MilestoneEntity

    @Column({nullable: true})
    milestoneId: string

    @Column('simple-array')
    assigneeIds: string[]

    @Column({ nullable: false })
    time: string

    @Column({nullable: false})
    label: string

    @Column({nullable: false})
    text: string

    @Column({nullable: false, default: 'open'})
    state: 'open' | 'closed'

    @OneToMany(() => CommentEntity, comment => comment.issue)
    comments: CommentEntity[]
}