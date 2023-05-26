import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { TagAssignment } from 'productboard-common'

import { IssueEntity } from './issue'
import { TagEntity } from './tag'

@Entity()
export class TagAssignmentEntity extends TagAssignment {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false })
    override created: number

    @Column({ nullable: false, default: 0 })
    override updated: number
    
    @Column({ nullable: true })
    override deleted: number

    @ManyToOne(() => TagEntity)
    @JoinColumn({ name: 'tagId' })
    tag: TagEntity

    @Column({ nullable: false })
    override tagId: string

    @ManyToOne(() => IssueEntity)
    @JoinColumn({ name: 'issueId' })
    issue: IssueEntity

    @Column({nullable: false})
    override issueId: string
}