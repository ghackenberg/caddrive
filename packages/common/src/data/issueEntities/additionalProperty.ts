import { ApiProperty } from '@nestjs/swagger'

export class AdditionalPropertyUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    modificationDate: string
    @ApiProperty()
    type: string
    @ApiProperty()
    value: JSON
}

export class AdditionalPropertyAddData extends AdditionalPropertyUpdateData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    issueId: string
    @ApiProperty()
    creationDate: string
}

export class AdditionalProperty extends AdditionalPropertyAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}