import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { IssueEntity } from './issue'
import { UserEntity } from './user'

@Entity()
export class CommentEntity {
    @PrimaryColumn({ nullable: false })
    id: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    userId: string

    @ManyToOne(() => IssueEntity)
    @JoinColumn({ name: 'issueId' })
    issue: IssueEntity

    @Column({ nullable: false })
    issueId: string

    @Column({ nullable: false })
    time: string

    @Column({ nullable: false })
    text: string

    @Column({ nullable: false, default: 'none' })
    action: 'none' | 'close' | 'reopen'
}