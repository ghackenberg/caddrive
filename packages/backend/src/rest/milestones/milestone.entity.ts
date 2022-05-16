import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { IssueEntity } from "../issues/issue.entity";
import { ProductEntity } from "../products/product.entity";
import { UserEntity } from "../users/user.entity";

@Entity()
export class MilestoneEntity {
    @PrimaryColumn({ nullable: false })
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({nullable: false})
    userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity

    @Column({ nullable: false })
    productId: string

    @Column({ nullable: false })
    label: string

    @Column({ nullable: false })
    start: string

    @Column({ nullable: false })
    end: string

    @OneToMany(() => IssueEntity, issue => issue.milestoneId)
    issues: IssueEntity[]
}