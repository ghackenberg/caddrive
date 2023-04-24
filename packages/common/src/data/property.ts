import { ApiProperty } from '@nestjs/swagger'

export class PropertyUpdateData {
    @ApiProperty()
    value: string
    @ApiProperty()
    modificationDate: string
}

export class PropertyAddData extends PropertyUpdateData {
    @ApiProperty()
    issueId: string
    @ApiProperty()
    propertyTypeId: string
    @ApiProperty()
    creationDate: string
}

export class Property extends PropertyAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}