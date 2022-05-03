import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ProductEntity } from '../products/product.entity'

@Entity()
export class UserEntity {
    @PrimaryColumn()
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @Column({ nullable: false, unique: true })
    email: string

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false })
    pictureId: string

    @OneToMany(() => ProductEntity, product => product.user)
    products: ProductEntity[]
}