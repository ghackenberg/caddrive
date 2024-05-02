import { ApiProperty } from '@nestjs/swagger'

export class CommentUpdate {
    @ApiProperty()
    text: string
}

export class CommentCreate extends CommentUpdate {
    @ApiProperty()
    action: 'none' | 'close' | 'reopen'
}

export class CommentRead extends CommentCreate {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    issueId: string
    @ApiProperty()
    commentId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number
}