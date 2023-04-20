import { ApiProperty } from '@nestjs/swagger'

export class PropertyTypeUpdateData {
    @ApiProperty()
    issueTypeId: string
    @ApiProperty()
    name: string
    @ApiProperty()
    type: string
    @ApiProperty()
    required: boolean
}

export class PropertyTypeAddData extends PropertyTypeUpdateData {
    
}

export class PropertyType extends PropertyTypeAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}