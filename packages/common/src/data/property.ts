import { ApiProperty } from '@nestjs/swagger'

export class PropertyUpdateData {
    @ApiProperty()
    value: string
    
}

export class PropertyAddData extends PropertyUpdateData {
    @ApiProperty()
    issueId: string
    @ApiProperty()
    propertyTypeId: string
    
}

export class Property extends PropertyAddData {
    @ApiProperty()
    id: string

    @ApiProperty()
    created: string
    @ApiProperty()
    updated: string
    @ApiProperty()
    deleted: number
}