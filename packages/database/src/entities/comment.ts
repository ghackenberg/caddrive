import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'

import { Comment } from 'productboard-common'

import { AttachmentEntity } from './attachment'
import { IssueEntity } from './issue'
import { UserEntity } from './user'

@Entity()
export class CommentEntity extends Comment {
    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: false, default: 0 })
    override updated: number
    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: true })
    override audioId: string

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    override userId: string

    @ManyToOne(() => IssueEntity)
    @JoinColumn({ name: 'issueId' })
    issue: IssueEntity

    @Column({ nullable: false })
    override issueId: string

    @Column({ nullable: false })
    override text: string

    @Column({ nullable: false, default: 'none' })
    override action: 'none' | 'close' | 'reopen'

    @OneToMany(() => AttachmentEntity, (attachment) => attachment.comment)
    attachments: AttachmentEntity[]
}