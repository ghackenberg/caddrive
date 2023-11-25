import { ApiProperty } from '@nestjs/swagger'

export class AttachmentUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    type: string
}

export class AttachmentAddData extends AttachmentUpdateData {

}

export class Attachment extends AttachmentAddData {
    @ApiProperty()
    productId: string
    @ApiProperty()
    issueId: string
    @ApiProperty()
    commentId: string
    @ApiProperty()
    attachmentId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number
}