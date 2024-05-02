import { ApiProperty } from '@nestjs/swagger'

export type MemberRole = 'manager' | 'engineer' | 'customer'

export class MemberUpdate {
    @ApiProperty()
    role: MemberRole
}

export class MemberCreate extends MemberUpdate {
    @ApiProperty()
    userId: string
}

export class MemberRead extends MemberCreate {
    @ApiProperty()
    productId: string
    @ApiProperty()
    memberId: string
    
    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number
}