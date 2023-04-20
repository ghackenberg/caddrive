import { ApiProperty } from '@nestjs/swagger'

export class IssueTypeUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    parentIssueId: string
    @ApiProperty()
    initialStateId: string
}

export class IssueTypeAddData extends IssueTypeUpdateData {
    
}

export class IssueType extends IssueTypeAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}