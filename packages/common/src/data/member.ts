import { ApiProperty } from '@nestjs/swagger'

export type MemberRole = 'manager' | 'engineer' | 'customer'

export class MemberUpdateData {
    @ApiProperty()
    role: MemberRole
}

export class MemberAddData extends MemberUpdateData {
    @ApiProperty()
    userId: string
}

export class Member extends MemberAddData {
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