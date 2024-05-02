import { ApiProperty } from '@nestjs/swagger'

export class ProductUpdate {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    public: boolean
}

export class ProductCreate extends ProductUpdate {
}

export class ProductRead extends ProductCreate {
    @ApiProperty()
    productId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number

    @ApiProperty()
    userId: string
}