import { ApiProperty } from '@nestjs/swagger'

// User

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
}

// Product

export class ProductData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    name: string
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
    time: string
    @ApiProperty()
    major: number
    @ApiProperty()
    minor: number
    @ApiProperty()
    patch: number
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
}

export class Comment extends CommentData {
    @ApiProperty()
    id: string
}