import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Product } from 'fhooe-audit-platform-common'
import { ProductService } from './product.service'

@Controller('api/products')
export class ProductController {
    constructor(private productService: ProductService) {

    }

    @Get()
    @ApiResponse({ type: [Product] })
    async findAll() {
        return this.productService.findAll()
    }
}