import { ApiProperty } from '@nestjs/swagger'

export class IssueUpdateData {
    @ApiProperty()
    label: string
    @ApiProperty()
    text: string
    @ApiProperty()
    state: 'open' | 'closed'
    @ApiProperty()
    assigneeIds: string[]
    
}

export class IssueAddData extends IssueUpdateData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    time: string
}

export class Issue extends IssueAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}