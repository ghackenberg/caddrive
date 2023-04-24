import { Column, Entity, PrimaryColumn } from 'typeorm'

import { IssueTypeHierarchy } from 'productboard-common'

@Entity()
export class IssueTypeHierarchyEntity extends IssueTypeHierarchy {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({nullable: false})
    override parentIssueTypeId: string

    @Column({nullable: false})
    override childIssueTypeId: string
}