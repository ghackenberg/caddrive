import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { IssueEntity } from "../issues/issue.entity";
import { UserEntity } from "../users/user.entity";

@Entity()
export class CommentEntity {
    @PrimaryColumn()
    id: string

    @Column()
    deleted: boolean

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity

    @Column({ nullable: false })
    userId: string

    @ManyToOne(() => IssueEntity)
    @JoinColumn({ name: 'issueId' })
    issue: IssueEntity

    @Column()
    issueId: string

    @Column()
    time: string

    @Column()
    text: string

    @Column()
    action: 'none' | 'close' | 'reopen'

}