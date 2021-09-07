import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger'
import { Product, ProductData, ProductREST } from 'fhooe-audit-platform-common'
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

    @Get(':name')
    @ApiParam({ name: 'name' })
    @ApiResponse({ type: [Product] })
    async findProducts(@Param('name') name: string): Promise<Product[]> {
        return this.productService.findProducts(name)
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: Product })
    async getProduct(@Param('id') id: string): Promise<Product> {
        return this.productService.getProduct(id)
    }

    @Post() 
    @ApiBody({ type: ProductData })
    @ApiResponse({ type: Product })
    async addProduct(@Body() product: ProductData): Promise<Product> {
        return this.productService.addProduct(product)
    }

    @Put()
    @ApiBody({ type: Product })
    @ApiResponse({ type: Product })
    async updateProduct(@Body() product: Product): Promise<Product> {
        return this.productService.updateProduct(product)
    }
}