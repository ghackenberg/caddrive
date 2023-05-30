import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Attachment } from 'productboard-common'

import { CommentEntity } from './comment'

@Entity()
export class AttachmentEntity extends Attachment {

    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: false, default: 0 })
    override updated: number
    @Column({ nullable: true })
    override deleted: number
    @Column({ nullable: false })
    override commentId: string

    @Column({nullable: false})
    override userId: string

    @Column({nullable: false})
    override name: string

    @Column({nullable: false})
    override description: string

    @Column({nullable: false})
    override type: string

    @Column({nullable: false})
    override data: string

    @ManyToOne(() => CommentEntity)
    @JoinColumn({ name: 'commentId' })
    comment: CommentEntity
}