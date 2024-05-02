import { ApiProperty } from '@nestjs/swagger'

export class IssueUpdate {
    @ApiProperty()
    label: string
    @ApiProperty()
    assignedUserIds: string[]
    @ApiProperty()
    milestoneId: string
}

export class IssueCreate extends IssueUpdate {
}

export class IssueRead extends IssueCreate {
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