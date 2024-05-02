import { ApiProperty } from '@nestjs/swagger'

export class AttachmentUpdate {
    @ApiProperty()
    name: string
    @ApiProperty()
    type: string
}

export class AttachmentCreate extends AttachmentUpdate {

}

export class AttachmentRead extends AttachmentCreate {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    attachmentId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number
}