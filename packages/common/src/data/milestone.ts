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
    @ApiProperty()
    productId: string
}

export class Milestone extends MilestoneAddData {
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
}