import { Column, Entity, PrimaryColumn } from 'typeorm'

import { PropertyType } from 'productboard-common'

@Entity()
export class PropertyTypeEntity extends PropertyType {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true })
    override deleted: number

    @Column({nullable: false})
    override issueTypeId: string

    @Column({nullable: false})
    override name: string

    @Column({nullable: false})
    override type: string

    @Column({nullable: false})
    override required: boolean
}