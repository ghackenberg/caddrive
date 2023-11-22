import { ApiProperty } from '@nestjs/swagger'

export class IssueUpdateData {
    @ApiProperty()
    label: string
    @ApiProperty()
    assignedUserIds: string[]
    @ApiProperty()
    milestoneId: string
}

export class IssueAddData extends IssueUpdateData {
}

export class Issue extends IssueAddData {
    @ApiProperty()
    userId: string
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
    number: number
    @ApiProperty()
    state: 'open' | 'closed'
}