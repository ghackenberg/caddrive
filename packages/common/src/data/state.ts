import { ApiProperty } from '@nestjs/swagger'

export class StateUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    issueTypeId: string
}

export class StateAddData extends StateUpdateData {
    
}

export class State extends StateAddData {
    @ApiProperty()
    id: string
    
    @ApiProperty()
    deleted: number
}