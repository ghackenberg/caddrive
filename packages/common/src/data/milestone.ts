import { ApiProperty } from '@nestjs/swagger'

export class MilestoneUpdateData {
    @ApiProperty()
    label: string
    
    @ApiProperty()
    start: number
    @ApiProperty()
    end: number
}

export class MilestoneAddData extends MilestoneUpdateData {
}

export class Milestone extends MilestoneAddData {
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

    @ApiProperty()
    userId: string
}