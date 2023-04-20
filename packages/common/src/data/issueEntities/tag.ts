import { ApiProperty } from '@nestjs/swagger'

export class TagUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    color: string
}

export class TagAddData extends TagUpdateData {
    
}

export class Tag extends TagAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}