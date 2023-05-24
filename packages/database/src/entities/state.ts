import { Column, Entity, PrimaryColumn } from 'typeorm'

import { State } from 'productboard-common'

@Entity()
export class StateEntity extends State {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true })
    override deleted: number

    @Column({nullable: false})
    override issueTypeId: string

    @Column({nullable: false})
    override name: string

    @Column({nullable: false})
    override description: string
}