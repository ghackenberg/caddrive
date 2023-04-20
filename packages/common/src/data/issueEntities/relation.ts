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
    modificationDate: string
    @ApiProperty()
    type: string
}

export class RelationAddData extends RelationUpdateData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    creationDate: string
}

export class Relation extends RelationAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}