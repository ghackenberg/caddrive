import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { Milestone } from 'productboard-common'

import { IssueEntity } from './issue'
import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class MilestoneEntity extends Milestone {
    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: false })
    override updated: number
    @Column({ nullable: true })
    override deleted: number

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

    @Column({ nullable: false })
    override label: string

    @Column({ nullable: false })
    override start: number
    @Column({ nullable: false })
    override end: number

    @OneToMany(() => IssueEntity, issue => issue.milestoneId)
    issues: IssueEntity[]
}