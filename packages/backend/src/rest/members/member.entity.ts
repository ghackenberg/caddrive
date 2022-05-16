import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { ProductEntity } from "../products/product.entity"
import { UserEntity } from "../users/user.entity"


@Entity()
export class MemberEntity {
    @PrimaryColumn({ nullable: false })
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity

    @Column({ nullable: false })
    productId: string

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    userId: string
}