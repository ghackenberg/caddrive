import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ProductEntity } from "../products/product.entity";

@Entity()
export class IssueEntity {

    @PrimaryColumn({nullable: false})
    id: string

    @Column({nullable: false})
    deleted: boolean

    @Column({nullable: false})
    userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity

    @Column({nullable: false})
    productId: string

    @Column({nullable: false})
    time: string

    @Column({nullable: false})
    label: string

    @Column({nullable: false})
    text: string

    @Column({nullable: false})
    state: 'open' | 'closed'

    @Column('simple-array')
    assigneeIds: string[]

    @Column({nullable: true})
    milesoneId: string

}