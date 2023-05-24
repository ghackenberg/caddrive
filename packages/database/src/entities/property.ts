import { Column, Entity, PrimaryColumn } from 'typeorm'

import { Property } from 'productboard-common'

@Entity()
export class PropertyEntity extends Property {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: false })
    override issueId: string

    @Column({nullable: false})
    override propertyTypeId: string

    @Column({nullable: false})
    override created: string

    @Column({nullable: false})
    override updated: string
    
    @Column({nullable: false})
    override value: string
}