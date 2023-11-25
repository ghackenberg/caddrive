import { ApiProperty } from '@nestjs/swagger'

export class AttachmentUpdateData {
    @ApiProperty()
    type: string
}

export class AttachmentAddData extends AttachmentUpdateData {

}

export class Attachment extends AttachmentAddData {
    @ApiProperty()
    productId: string
    @ApiProperty()
    attachmentId: string
    @ApiProperty()
    userId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number
}