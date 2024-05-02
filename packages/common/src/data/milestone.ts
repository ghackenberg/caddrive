import { ApiProperty } from '@nestjs/swagger'

export class MilestoneUpdate {
    @ApiProperty()
    label: string
    
    @ApiProperty()
    start: number
    @ApiProperty()
    end: number
}

export class MilestoneCreate extends MilestoneUpdate {
}

export class MilestoneRead extends MilestoneCreate {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    milestoneId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number

    // Computed properties

    @ApiProperty()
    openIssueCount?: number
    @ApiProperty()
    closedIssueCount?: number
}