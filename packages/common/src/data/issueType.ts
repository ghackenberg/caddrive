import { ApiProperty } from '@nestjs/swagger'

export class IssueTypeUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    baseIssueTypeId: string
    @ApiProperty()
    initialStateId: string
}

export class IssueTypeAddData extends IssueTypeUpdateData {
    @ApiProperty()
    productId: string
}

export class IssueType extends IssueTypeAddData {
    @ApiProperty()
    id: string

    @ApiProperty()
    deleted: number
}