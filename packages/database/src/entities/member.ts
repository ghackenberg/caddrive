import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Member, MemberRole } from 'productboard-common'

import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class MemberEntity extends Member {
    @Column({ nullable: false })
    override productId: string
    @PrimaryColumn({ nullable: false })
    override memberId: string
    @Column({ nullable: false })
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

    @Column({ nullable: false, type: 'simple-enum', enum: ["manager", "engineer", "customer"] })
    override role: MemberRole
}