import { ApiProperty } from '@nestjs/swagger'

export class GuardUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    type: string
    @ApiProperty()
    configuration: string
}

export class GuardAddData extends GuardUpdateData {
    @ApiProperty()
    transitionId: string
}

export class Guard extends GuardAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}