import { ApiProperty } from '@nestjs/swagger'

export class User {
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