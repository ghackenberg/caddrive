import { ApiProperty } from '@nestjs/swagger'

export class ProductUpdate {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    public: boolean
}

export class ProductCreate extends ProductUpdate {
}

export class ProductRead extends ProductCreate {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number

    // Computed properties

    @ApiProperty()
    versionCount?: number
    @ApiProperty()
    openIssueCount?: number
    @ApiProperty()
    closedIssueCount?: number
    @ApiProperty()
    openMilestoneCount?: number
    @ApiProperty()
    closedMilestoneCount?: number
    @ApiProperty()
    memberCount?: number
}