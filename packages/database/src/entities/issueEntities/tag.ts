import { Column, Entity, PrimaryColumn } from 'typeorm'

import { Tag } from 'productboard-common'

@Entity()
export class TagEntity extends Tag {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({ nullable: false })
    override name: string

    @Column({nullable: false})
    override color: string

}