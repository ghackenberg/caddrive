import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { Attachment } from 'productboard-common'

import { ProductEntity } from './product'
import { UserEntity } from './user'

@Entity()
export class AttachmentEntity extends Attachment {
    @Column({ nullable: false })
    override productId: string
    @PrimaryColumn({ nullable: false })
    override attachmentId: string
    @Column({ nullable: false })
    override userId: string

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'productId' })
    product: ProductEntity
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    override created: number
    @Column({ nullable: false })
    override updated: number
    @Column({ nullable: true })
    override deleted: number
    
    @Column({ nullable: false })
    override type: string
}