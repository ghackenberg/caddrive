import { ApiProperty } from '@nestjs/swagger'

export class CommentUpdateData {
    @ApiProperty()
    text: string
}

export class CommentAddData extends CommentUpdateData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    issueId: string
    @ApiProperty()
    time: string
}

export class Comment extends CommentAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}