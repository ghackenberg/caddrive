import { Column, Entity, PrimaryColumn } from 'typeorm'

import { TagAssignment } from 'productboard-common'

@Entity()
export class TagAssignmentEntity extends TagAssignment {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: false })
    override tagId: string

    @Column({nullable: false})
    override issueId: string
}