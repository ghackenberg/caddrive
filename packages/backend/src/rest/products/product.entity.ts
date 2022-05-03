import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { UserEntity } from '../users/user.entity'

@Entity()
export class ProductEntity {
    @PrimaryColumn()
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @ManyToOne(() => UserEntity)
    user: UserEntity
}