import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { IssueEntity } from "../issues/issue.entity";
import { ProductEntity } from "../products/product.entity";
import { UserEntity } from "../users/user.entity";

@Entity()
export class MilestoneEntity {
    @PrimaryColumn()
    id: string

    @Column()
    deleted: boolean

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({nullable: false})
    userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity

    @Column()
    productId: string

    @Column()
    label: string

    @Column()
    start: string

    @Column()
    end: string

    @OneToMany(() => IssueEntity, issue => issue.milestoneId)
    issues: IssueEntity[]
}