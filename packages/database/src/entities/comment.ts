import { Comment } from 'productboard-common'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { IssueEntity } from './issue'
import { UserEntity } from './user'

@Entity()
export class CommentEntity extends Comment {
    @PrimaryColumn({ nullable: false })
    override id: string

    @Column({ nullable: false, default: false })
    override deleted: boolean

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
    override time: string

    @Column({ nullable: false })
    override text: string

    @Column({ nullable: false, default: 'none' })
    override action: 'none' | 'close' | 'reopen'
}