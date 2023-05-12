import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class TokenEntity {
    @PrimaryColumn({ nullable: false })
    id: string
    
    @Column({ nullable: false })
    created: number
    @Column({ nullable: false, default: 0 })
    updated: number
    @Column({ nullable: true })
    deleted: number

    @Column({ nullable: false })
    email: string
    @Column({ nullable: false })
    code: string
    @Column({ nullable: false })
    count: number
}