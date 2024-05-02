import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { IssueEntity } from './issue'
import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class MilestoneEntity {
    @Column({ nullable: false })
    productId: string
    @PrimaryColumn({ nullable: false })
    milestoneId: string
    @Column({nullable: false})
    userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    created: number
    @Column({ nullable: false, default: 0 })
    updated: number
    @Column({ nullable: true })
    deleted: number

    @Column({ nullable: false })
    start: number
    @Column({ nullable: false })
    end: number
    @Column({ nullable: false })
    label: string

    @OneToMany(() => IssueEntity, issue => issue.milestone)
    issues: IssueEntity[]
}