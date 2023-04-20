import { Column, Entity, PrimaryColumn } from 'typeorm'

import { Property } from 'productboard-common'

@Entity()
export class PropertyEntity extends Property {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({ nullable: false })
    override issueId: string

    @Column({nullable: false})
    override propertyTypeId: string

    @Column({nullable: false})
    override creationDate: string

    @Column({nullable: false})
    override modificationDate: string
    
    @Column({nullable: false})
    override value: JSON
}