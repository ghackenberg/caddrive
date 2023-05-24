import { Column, Entity, PrimaryColumn } from 'typeorm'

import { Relation } from 'productboard-common'

@Entity()
export class RelationEntity extends Relation {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: false })
    override sourceIssueId: string

    @Column({ nullable: false })
    override targetIssueId: string

    @Column({nullable: false})
    override userId: string

    @Column({nullable: false})
    override name: string

    @Column({nullable: false})
    override created: string

    @Column({nullable: false})
    override updated: string

    @Column({nullable: false})
    override description: string

    @Column({nullable: false})
    override type: string
}