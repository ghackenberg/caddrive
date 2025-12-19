import { MemberRole } from 'productboard-common'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from 'typeorm'
import { ProductEntity } from './product.js'
import { UserEntity } from './user.js'

@Entity()
export class MemberEntity {
    @Column({ nullable: false })
    productId: string
    @PrimaryColumn({ nullable: false })
    memberId: string
    @Column({ nullable: false })
    userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: Relation<ProductEntity>
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: Relation<UserEntity>

    @Column({ nullable: false })
    created: number
    @Column({ nullable: false, default: 0 })
    updated: number
    @Column({ nullable: true })
    deleted: number

    @Column({ nullable: false, type: 'simple-enum', enum: ["manager", "engineer", "customer"] })
    role: MemberRole
}