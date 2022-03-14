import { ApiProperty } from '@nestjs/swagger'

// User

// TODO alles updatebar
export class UserData {
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
    @ApiProperty()
    password: string
}

export class User extends UserData {
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
export class VersionData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    baseVersionIds: string[]
    @ApiProperty()
    time: string
    @ApiProperty()
    major: number
    @ApiProperty()
    minor: number
    @ApiProperty()
    patch: number
    @ApiProperty()
    description: string
}

export class Version extends VersionData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}

// Issue

// TODO label text state updatebar
export class IssueData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    time: string
    @ApiProperty()
    label: string
    @ApiProperty()
    text: string
    @ApiProperty()
    state: 'open' | 'closed'
}

export class Issue extends IssueData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}

// Comment
// TODO text updatebar
export class CommentData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    issueId: string
    @ApiProperty()
    time: string
    @ApiProperty()
    text: string
}

export class Comment extends CommentData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}

// Member
// TODO Nichts updatebar-> leere klasse für updatedata machen
export class MemberData {
    @ApiProperty()
    productId: string
    @ApiProperty()
    userId: string
}

export class Member extends MemberData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}