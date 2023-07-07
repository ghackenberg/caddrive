import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Comment } from 'productboard-common'

import { IssueEntity } from './issue'
import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class CommentEntity extends Comment {
    @Column({ nullable: false })
    override productId: string
    @Column({ nullable: false })
    override issueId: string
    @PrimaryColumn({ nullable: false })
    override commentId: string
    @Column({ nullable: false })
    override userId: string
    @Column({ nullable: true })
    override audioId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity
    @ManyToOne(() => IssueEntity)
    @JoinColumn({ name: 'issueId' })
    issue: IssueEntity
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: false, default: 0 })
    override updated: number
    @Column({ nullable: true })
    override deleted: number

    @Column({ nullable: false })
    override text: string
    @Column({ nullable: false, default: 'none' })
    override action: 'none' | 'close' | 'reopen'
}