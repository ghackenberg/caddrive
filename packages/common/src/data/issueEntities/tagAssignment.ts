import { ApiProperty } from '@nestjs/swagger'

export class TagAssignmentUpdateData {
    @ApiProperty()
    tagId: string
    @ApiProperty()
    issueId: string
}

export class TagAssignmentAddData extends TagAssignmentUpdateData {
    
}

export class TagAssignment extends TagAssignmentAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}