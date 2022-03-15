import { ApiProperty } from '@nestjs/swagger'

export class MemberUpdateData {

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