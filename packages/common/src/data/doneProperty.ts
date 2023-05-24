import { ApiProperty } from '@nestjs/swagger'

export class DonePropertyUpdateData {
    @ApiProperty()
    value: boolean
}

export class DonePropertyAddData extends DonePropertyUpdateData {
    @ApiProperty()
    issueId: string
    @ApiProperty()
    doneCriterionId: string
}

export class DoneProperty extends DonePropertyAddData {
    @ApiProperty()
    id: string

    @ApiProperty()
    deleted: number
}