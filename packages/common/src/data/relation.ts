import { ApiProperty } from '@nestjs/swagger'

export class RelationUpdateData {
    @ApiProperty()
    sourceIssueId: string
    @ApiProperty()
    targetIssueId: string
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    
    @ApiProperty()
    type: string
}

export class RelationAddData extends RelationUpdateData {
    
}

export class Relation extends RelationAddData {
    @ApiProperty()
    id: string

    @ApiProperty()
    created: string
    @ApiProperty()
    updated: string
    @ApiProperty()
    deleted: number

    @ApiProperty()
    userId: string
}