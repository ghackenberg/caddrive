import { ApiProperty } from '@nestjs/swagger'

export class IssueUpdateData {
    @ApiProperty()
    label: string
    @ApiProperty()
    text: string
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