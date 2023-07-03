import { ApiProperty } from '@nestjs/swagger'

export class IssueUpdateData {
    @ApiProperty()
    label: string
    @ApiProperty()
    text: string
    @ApiProperty()
    assignedUserIds: string[]
    @ApiProperty()
    milestoneId: string
}

export class IssueAddData extends IssueUpdateData {
}

export class Issue extends IssueAddData {
    @ApiProperty()
    productId: string
    @ApiProperty()
    issueId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number
    
    @ApiProperty()
    state: 'open' | 'closed'

    @ApiProperty()
    userId: string
    @ApiProperty()
    audioId: string
}