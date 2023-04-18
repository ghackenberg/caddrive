import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Version } from 'productboard-common'

import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class VersionEntity extends Version {
    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    override userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity

    @Column({ nullable: false })
    override productId: string

    //@Column({ nullable: false, array: true })
    @Column('simple-array')
    override baseVersionIds: string[]

    @Column({ nullable: false })
    override time: string

    @Column({ nullable: false })
    override major: number

    @Column({ nullable: false })
    override minor: number

    @Column({ nullable: false })
    override patch: number

    @Column({ nullable: false })
    override description: string

    @Column({ nullable: false })
    override modelType: 'glb' | 'ldr' | 'mpd'

    @Column({ nullable: false })
    override imageType: 'png'
}