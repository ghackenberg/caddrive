import { ApiProperty } from '@nestjs/swagger'

export type MemberRole = 'manager' | 'engineer' | 'customer'


export class MemberUpdateData {
    @ApiProperty()
    role: MemberRole
}

export class MemberAddData extends MemberUpdateData {
    @ApiProperty()
    productId: string
    @ApiProperty()
    userId: string
}

export class Member extends MemberAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}