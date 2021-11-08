import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiResponse, ApiParam, ApiQuery, ApiBasicAuth } from '@nestjs/swagger'
import { Product, ProductData, ProductREST } from 'fhooe-audit-platform-common'
import { ProductService } from './product.service'

@Controller('rest/products')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class ProductController implements ProductREST {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Get()
    @ApiQuery({ name: 'quick', type: 'string', required: false })
    @ApiQuery({ name: 'name', type: 'string', required: false })
    @ApiResponse({ type: [Product] })
    async findProducts(
        @Query('quick') quick?: string,
        @Query('name') name?: string
    ): Promise<Product[]> {
        return this.productService.findProducts(quick, name)
    }

    @Post()
    @ApiBody({ type: ProductData, required: true })
    @ApiResponse({ type: Product })
    async addProduct(
        @Body() data: ProductData
    ): Promise<Product> {
        return this.productService.addProduct(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Product, })
    async getProduct(
        @Param('id') id: string
    ): Promise<Product> {
        return this.productService.getProduct(id)
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Product })
    @ApiResponse({ type: Product })
    async updateProduct(
        @Param('id') id: string,
        @Body() data: ProductData
    ): Promise<Product> {
        return this.productService.updateProduct(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Product })
    async deleteProduct(
        @Param('id') id: string
    ): Promise<Product> {
        return this.productService.deleteProduct(id)
    }
}