import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { ProductEntity } from "../products/product.entity"


@Entity()
export class MemberEntity {
    @PrimaryColumn()
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @Column({ nullable: false })
    productId: string
    
    @Column({ nullable: false })
    userId: string

    @ManyToOne(() => ProductEntity)
    product: ProductEntity
}