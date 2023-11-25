import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Attachment } from 'productboard-common'

import { CommentEntity } from './comment'
import { IssueEntity } from './issue'
import { ProductEntity } from './product'

@Entity()
export class AttachmentEntity extends Attachment {
    @Column({ nullable: false })
    override productId: string
    @Column({ nullable: false })
    override issueId: string
    @Column({ nullable: false })
    override commentId: string
    @PrimaryColumn({ nullable: false })
    override attachmentId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity
    @ManyToOne(() => IssueEntity)
    @JoinColumn({ name: 'issueId' })
    issue: IssueEntity
    @ManyToOne(() => CommentEntity)
    @JoinColumn({ name: 'commentId' })
    comment: CommentEntity

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: false })
    override updated: number
    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: false })
    override name: string
    @Column({ nullable: false })
    override type: string
}