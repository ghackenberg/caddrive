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
    name: string
}

export class Product extends ProductData {
    @ApiProperty()
    id: string
}

// Version

export class VersionData {
    @ApiProperty()
    name: string
    @ApiProperty()
    date: string
    @ApiProperty()
    productId: string
}

export class Version extends VersionData {
    @ApiProperty()
    id: string
}

// Audit

export class AuditData {
    @ApiProperty()
    name: string
    @ApiProperty()
    start: string
    @ApiProperty()
    end: string
    @ApiProperty()
    versionId: string
}

export class Audit extends AuditData {
    @ApiProperty()
    id: string
}

// Event

export class EventData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    auditId: string
    @ApiProperty()
    time: string
    @ApiProperty()
    type: string
}

export class Event extends EventData {
    @ApiProperty()
    id: string
}

// EnterEvent

export class EnterEventData extends EventData {
    @ApiProperty()
    override readonly type = 'enter'
}

export class EnterEvent extends EventData {
    @ApiProperty()
    id: string
}

// LeaveEvent

export class LeaveEventData extends EventData {
    @ApiProperty()
    override readonly type = 'leave'
}

export class LeaveEvent extends EventData {
    @ApiProperty()
    id: string
}

// CommentEvent

export class CommentEventData extends EventData {
    @ApiProperty()
    override readonly type = 'comment'
    @ApiProperty()
    text: string
}

export class CommentEvent extends CommentEventData {
    @ApiProperty()
    id: string
}