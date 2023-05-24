import { ApiProperty } from '@nestjs/swagger'

export class ReadyCriterionUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
}

export class ReadyCriterionAddData extends ReadyCriterionUpdateData {
    @ApiProperty()
    issueTypeId: string
}

export class ReadyCriterion extends ReadyCriterionAddData {
    @ApiProperty()
    id: string
    
    @ApiProperty()
    deleted: number
}