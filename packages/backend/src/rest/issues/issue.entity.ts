import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { CommentEntity } from "../comments/comment.entity";
import { MilestoneEntity } from "../milestones/milestone.entity";
import { ProductEntity } from "../products/product.entity";
import { UserEntity } from "../users/user.entity";

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

    @Column({ nullable: false })
    time: string

    @Column({nullable: false})
    label: string

    @Column({nullable: false})
    text: string

    @Column({nullable: false, default: 'open'})
    state: 'open' | 'closed'

    @Column('simple-array')
    assigneeIds: string[]

    @ManyToOne(() => MilestoneEntity)
    @JoinColumn({ name: 'milestoneId' })
    milestone: MilestoneEntity

    @Column({nullable: true})
    milestoneId: string

    @OneToMany(() => CommentEntity, comment => comment.issue)
    comment: CommentEntity[]

}