import { ApiProperty } from '@nestjs/swagger'

export class ActionUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    type: string
    @ApiProperty()
    configuration: JSON
}

export class ActionAddData extends ActionUpdateData {
    @ApiProperty()
    transitionId: string
}

export class Action extends ActionAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}