import { Column, Entity, PrimaryColumn } from 'typeorm'

import { TagAssignment } from 'productboard-common'

@Entity()
export class TagAssignmentEntity extends TagAssignment {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

    @Column({ nullable: false })
    override tagId: string

    @Column({nullable: false})
    override issueId: string
}