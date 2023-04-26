import { Column, Entity, PrimaryColumn } from 'typeorm'

import { IssueType } from 'productboard-common'

@Entity()
export class IssueTypeEntity extends IssueType {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true})
    override deleted: number

    @Column({nullable: false})
    override productId: string

    @Column({nullable: false})
    override baseIssueTypeId: string

    @Column({nullable: false})
    override initialStateId: string

    @Column({nullable: false})
    override name: string
}