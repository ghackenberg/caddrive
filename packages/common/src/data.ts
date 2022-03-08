import { ApiProperty } from '@nestjs/swagger'

// User

export class UserData {
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
    @ApiProperty()
    password: string
    @ApiProperty()
    deleted: boolean
}

export class User extends UserData {
    @ApiProperty()
    id: string 
}

// Product

export class ProductData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    deleted: boolean

}

export class Product extends ProductData {
    @ApiProperty()
    id: string
}

// Version

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
}

// Issue

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
    @ApiProperty()
    deleted: boolean
}

export class Issue extends IssueData {
    @ApiProperty()
    id: string
}

// Comment

export class CommentData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    issueId: string
    @ApiProperty()
    time: string
    @ApiProperty()
    text: string
    @ApiProperty()
    deleted: boolean
}

export class Comment extends CommentData {
    @ApiProperty()
    id: string
}

// Member

export class MemberData {
    @ApiProperty()
    productId: string
    @ApiProperty()
    userId: string
}

export class Member extends MemberData {
    @ApiProperty()
    id: string
}