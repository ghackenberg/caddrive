import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { Milestone } from 'productboard-common'

import { IssueEntity } from './issue'
import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class MilestoneEntity extends Milestone {
    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

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
    override start: string

    @Column({ nullable: false })
    override end: string

    @OneToMany(() => IssueEntity, issue => issue.milestoneId)
    issues: IssueEntity[]
}