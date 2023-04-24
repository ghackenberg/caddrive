import { Column, Entity, PrimaryColumn } from 'typeorm'

import { AdditionalProperty } from 'productboard-common'

@Entity()
export class AdditionalPropertyEntity extends AdditionalProperty {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({ nullable: false })
    override issueId: string

    @Column({nullable: false})
    override userId: string

    @Column({nullable: false})
    override name: string

    @Column({nullable: false})
    override creationDate: string

    @Column({nullable: false})
    override modificationDate: string

    @Column({nullable: false})
    override description: string

    @Column({nullable: false})
    override type: string

    @Column({nullable: false})
    override value: string
}