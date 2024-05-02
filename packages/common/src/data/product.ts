import { ApiProperty } from '@nestjs/swagger'

export class ProductUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    public: boolean
}

export class ProductAddData extends ProductUpdateData {
}

export class Product extends ProductAddData {
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