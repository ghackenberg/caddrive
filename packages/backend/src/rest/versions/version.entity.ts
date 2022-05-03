import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { ProductEntity } from '../products/product.entity'

@Entity()
export class VersionEntity {
    @PrimaryColumn()
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @Column({ nullable: false })
    userId: string

    @Column({ nullable: false })
    productId: string

    @Column({ nullable: false })
    baseVersionIds: string

    @Column({ nullable: false })
    time: string

    @Column({ nullable: false })
    major: number

    @Column({ nullable: false })
    minor: number

    @Column({ nullable: false })
    patch: number

    @Column({ nullable: false })
    description: string

    @ManyToOne(() => ProductEntity)
    product: ProductEntity

}