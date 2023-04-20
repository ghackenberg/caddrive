import { Column, Entity, PrimaryColumn } from 'typeorm'

import { IssueType } from 'productboard-common'

@Entity()
export class IssueTypeEntity extends IssueType {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({nullable: false})
    override parentIssueId: string

    @Column({nullable: false})
    override initialStateId: string

    @Column({nullable: false})
    override name: string
}