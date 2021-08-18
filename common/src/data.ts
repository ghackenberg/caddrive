import { ApiProperty } from '@nestjs/swagger'

export class AuditData {
    @ApiProperty()
    name: string
    @ApiProperty()
    start: string
    @ApiProperty()
    end: string
}

export class Audit extends AuditData {
    @ApiProperty()
    id: string
}

export class Event {
    @ApiProperty()
    time: number
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
    date: string
}

export class Version extends VersionData {
    @ApiProperty()
    id: string
}