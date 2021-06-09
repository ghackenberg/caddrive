import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Product, ProductREST } from 'fhooe-audit-platform-common'
import { ProductService } from './product.service'

@Controller('rest/products')
export class ProductController implements ProductREST {
    constructor(private productService: ProductService) {

    }

    @Get()
    @ApiResponse({ type: [Product] })
    async findAll() {
        return this.productService.findAll()
    }
}