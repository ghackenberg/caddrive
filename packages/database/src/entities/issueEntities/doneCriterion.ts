import { Column, Entity, PrimaryColumn } from 'typeorm'

import { DoneCriterion } from 'productboard-common'

@Entity()
export class DoneCriterionEntity extends DoneCriterion {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({nullable: false})
    override issueTypeId: string

    @Column({nullable: false})
    override name: string

    @Column({nullable: false})
    override description: string
}