import { ApiProperty } from '@nestjs/swagger'

export class AdditionalPropertyUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    type: string
    @ApiProperty()
    value: string
}

export class AdditionalPropertyAddData extends AdditionalPropertyUpdateData {
    @ApiProperty()
    issueId: string
    
}

export class AdditionalProperty extends AdditionalPropertyAddData {
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