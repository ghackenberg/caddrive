import { ApiProperty } from '@nestjs/swagger'

export class MilestoneUpdateData {
    @ApiProperty()
    label: string
    @ApiProperty()
    start: string
    @ApiProperty()
    end: string
}

export class MilestoneAddData extends MilestoneUpdateData {
    @ApiProperty()
    productId: string
}

export class Milestone extends MilestoneAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
    @ApiProperty()
    userId: string
}