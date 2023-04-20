import { Column, Entity, PrimaryColumn } from 'typeorm'

import { DoneProperty } from 'productboard-common'

@Entity()
export class DonePropertyEntity extends DoneProperty {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({ nullable: false })
    override issueId: string

    @Column({nullable: false})
    override doneCriterionId: string
    
    @Column({nullable: false})
    override value: boolean
}