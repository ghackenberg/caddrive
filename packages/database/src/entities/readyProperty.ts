import { Column, Entity, PrimaryColumn } from 'typeorm'

import { ReadyProperty } from 'productboard-common'

@Entity()
export class ReadyPropertyEntity extends ReadyProperty {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: false })
    override issueId: string

    @Column({nullable: false})
    override readyCriterionId: string
    
    @Column({nullable: false})
    override value: boolean
}