import { ApiProperty } from '@nestjs/swagger'

export class IssueUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    state: 'open' | 'closed'
    @ApiProperty()
    assigneeIds: string[]
    @ApiProperty()
    milestoneId: string
    @ApiProperty()
    parentIssueId: string
    @ApiProperty()
    stateId: string
    @ApiProperty()
    issueTypeId: string
    @ApiProperty()
    priority: string
    @ApiProperty()
    storypoints: number
    @ApiProperty()
    progress: number
}

export class IssueAddData extends IssueUpdateData {
    @ApiProperty()
    productId: string
}

export class Issue extends IssueAddData {
    @ApiProperty()
    id: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number

    @ApiProperty()
    userId: string
    @ApiProperty()
    audioId: string
}