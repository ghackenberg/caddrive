import { ApiProperty } from '@nestjs/swagger'

export class TransitionUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    sourceStateId: string
    @ApiProperty()
    targetStateId: string
}

export class TransitionAddData extends TransitionUpdateData {
    
}

export class Transition extends TransitionAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}