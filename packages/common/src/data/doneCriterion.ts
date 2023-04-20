import { ApiProperty } from '@nestjs/swagger'

export class DoneCriterionUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
}

export class DoneCriterionAddData extends DoneCriterionUpdateData {
    @ApiProperty()
    issueTypeId: string
}

export class DoneCriterion extends DoneCriterionAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}