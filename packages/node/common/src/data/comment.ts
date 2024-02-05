import { ApiProperty } from '@nestjs/swagger'

export class CommentUpdateData {
    @ApiProperty()
    text: string
}

export class CommentAddData extends CommentUpdateData {
    @ApiProperty()
    action: 'none' | 'close' | 'reopen'
}

export class Comment extends CommentAddData {
    @ApiProperty()
    productId: string
    @ApiProperty()
    issueId: string
    @ApiProperty()
    commentId: string
    @ApiProperty()
    userId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number
}