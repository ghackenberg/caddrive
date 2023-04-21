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
    @ApiProperty()
    milestoneId?: string
}

export class IssueAddData extends IssueUpdateData {
    @ApiProperty()
    productId: string
}

export class Issue extends IssueAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
    @ApiProperty()
    userId: string
    @ApiProperty()
    time: string
    @ApiProperty()
    audioId?: string
}