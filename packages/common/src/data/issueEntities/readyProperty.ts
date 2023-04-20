import { ApiProperty } from '@nestjs/swagger'

export class ReadyPropertyUpdateData {
    @ApiProperty()
    value: boolean
}

export class ReadyPropertyAddData extends ReadyPropertyUpdateData {
    @ApiProperty()
    issueId: string
    @ApiProperty()
    readyCriterionId: string
}

export class ReadyProperty extends ReadyPropertyAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}