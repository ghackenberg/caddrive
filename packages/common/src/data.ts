import { ApiProperty } from '@nestjs/swagger'

// User

// TODO alles updatebar
export class UserUpdateData {

}

export class UserAddData extends UserUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
    @ApiProperty()
    password: string
}

export class User extends UserAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}

// Product

export class ProductUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
}

export class ProductAddData extends ProductUpdateData {
    @ApiProperty()
    userId: string
}

export class Product extends ProductAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}

// Version

// TODO major, minor, patch, description updatebr
export class VersionUpdateData {
    @ApiProperty()
    major: number
    @ApiProperty()
    minor: number
    @ApiProperty()
    patch: number
    @ApiProperty()
    description: string
}
export class VersionAddData extends VersionUpdateData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    baseVersionIds: string[]
    @ApiProperty()
    time: string
}

export class Version extends VersionAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}

// Issue

// TODO label text state updatebar

export class IssueUpdateData {
    @ApiProperty()
    label: string
    @ApiProperty()
    text: string
    @ApiProperty()
    state: 'open' | 'closed'
}

export class IssueAddData extends IssueUpdateData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    time: string
}

export class Issue extends IssueAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}

// Comment
// TODO text updatebar

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


// Member
// TODO Nichts updatebar-> leere klasse für updatedata machen
export class MemberUpdateData {

}

export class MemberAddData extends MemberUpdateData {
    @ApiProperty()
    productId: string
    @ApiProperty()
    userId: string
}

export class Member extends MemberAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}