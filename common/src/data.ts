import { ApiProperty } from '@nestjs/swagger'

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

export class Product {
    @ApiProperty()
    id: string
}

export class Audit {
    @ApiProperty()
    id: string
}