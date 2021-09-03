import { ApiProperty } from '@nestjs/swagger'

export class AuditData {
    @ApiProperty()
    name: string
    @ApiProperty()
    start: Date
    @ApiProperty()
    end: Date
    @ApiProperty()
    productId: string
    @ApiProperty()
    versionId: string
}

export class Audit extends AuditData {
    @ApiProperty()
    id: string
}

export class EventData {
    @ApiProperty()
    time: Date
    @ApiProperty()
    audit: string
    @ApiProperty()
    user: string
    @ApiProperty()
    type: string
}

export class CommentEventData extends EventData {
    override readonly type = 'comment'
    @ApiProperty()
    text: string
}

export class CommentEvent extends CommentEventData {
    @ApiProperty()
    id: string
}

export class ProductData {
    @ApiProperty()
    name: string
}

export class Product extends ProductData {
    @ApiProperty()
    id: string
}

export class UserData {
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
}

export class User extends UserData {
    @ApiProperty()
    id: string 
}

export class VersionData {
    @ApiProperty()
    name: string
    @ApiProperty()
    date: Date
    @ApiProperty()
    product: string
}

export class Version extends VersionData {
    @ApiProperty()
    id: string
}