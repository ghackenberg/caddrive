import { ApiProperty } from '@nestjs/swagger'

export class AttachmentUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    modificationDate: string
    @ApiProperty()
    type: string
    @ApiProperty()
    data: string

}

export class AttachmentAddData extends AttachmentUpdateData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    issueId: string
    @ApiProperty()
    creationDate: string
}

export class Attachment extends AttachmentAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}