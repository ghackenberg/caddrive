import { ApiProperty } from '@nestjs/swagger'

export class PropertyTypeUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    type: string
    @ApiProperty()
    required: boolean
}

export class PropertyTypeAddData extends PropertyTypeUpdateData {
    @ApiProperty()
    issueTypeId: string
}

export class PropertyType extends PropertyTypeAddData {
    @ApiProperty()
    id: string

    @ApiProperty()
    deleted: number
}