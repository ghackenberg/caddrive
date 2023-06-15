import { ApiProperty } from '@nestjs/swagger'

export class AttachmentUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    type: string
}

export class AttachmentAddData extends AttachmentUpdateData {
    @ApiProperty()
    commentId: string
    @ApiProperty()
    userId: string
}

export class Attachment extends AttachmentAddData {
    @ApiProperty()
    id: string
    
    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number
}