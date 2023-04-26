import { Column, Entity, PrimaryColumn } from 'typeorm'

import { Guard } from 'productboard-common'

@Entity()
export class GuardEntity extends Guard {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true })
    override deleted: number

    @Column({nullable: false})
    override transitionId: string

    @Column({nullable: false})
    override name: string

    @Column({nullable: false})
    override type: string

    @Column({nullable: false})
    override configuration: string
}