import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { ApiBody, ApiResponse } from '@nestjs/swagger'
import { Product, ProductREST } from 'fhooe-audit-platform-common'
import { ProductService } from './product.service'

@Controller('rest/products')
export class ProductController implements ProductREST {
    constructor(private productService: ProductService) {

    }

    @Get()
    @ApiResponse({ type: [Product] })
    async findAll(): Promise<Product[]>  {
        return this.productService.findAll()
    }

    @Post() 
    @ApiBody({ type: Product })
    @ApiResponse({ type: Product })
    async addProduct(@Body() product: Product): Promise<Product> {
        return this.productService.addProduct(product)
    }

    @Put()
    @ApiBody({ type: Product })
    @ApiResponse({ type: Product })
    async updateProduct(@Body() product: Product): Promise<Product> {
        return this.productService.updateProduct(product)
    }
}