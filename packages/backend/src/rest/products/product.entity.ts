import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { UserEntity } from '../users/user.entity'

@Entity()
export class ProductEntity {
    @PrimaryColumn()
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @Column({ nullable: false })
    userId: string
    
    @Column({ nullable: false })
    name: string
    
    @Column({ nullable: false })
    description: string
    
    @ManyToOne(() => UserEntity)
    user: UserEntity
}