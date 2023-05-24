import { ApiProperty } from '@nestjs/swagger'

export class AttachmentUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    type: string
    @ApiProperty()
    data: string
    
}

export class AttachmentAddData extends AttachmentUpdateData {
    @ApiProperty()
    issueId: string
}

export class Attachment extends AttachmentAddData {
    @ApiProperty()
    id: string
    
    @ApiProperty()
    created: string
    @ApiProperty()
    updated: string
    @ApiProperty()
    deleted: number

    @ApiProperty()
    userId: string
}