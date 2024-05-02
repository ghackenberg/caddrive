import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { Milestone } from 'productboard-common'

import { IssueEntity } from './issue'
import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class MilestoneEntity extends Milestone {
    @Column({ nullable: false })
    override productId: string
    @PrimaryColumn({ nullable: false })
    override milestoneId: string
    @Column({nullable: false})
    override userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: false, default: 0 })
    override updated: number
    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: false })
    override start: number
    @Column({ nullable: false })
    override end: number
    @Column({ nullable: false })
    override label: string

    @OneToMany(() => IssueEntity, issue => issue.milestone)
    issues: IssueEntity[]
}