import { Column, Entity, PrimaryColumn } from 'typeorm'

import { IssueTypeHierarchy } from 'productboard-common'

@Entity()
export class IssueTypeHierarchyEntity extends IssueTypeHierarchy {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true })
    override deleted: number

    @Column({nullable: false})
    override baseIssueTypeId: string

    @Column({nullable: false})
    override childIssueTypeId: string
}