import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBody, ApiResponse, ApiParam, ApiBasicAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { ProductService } from './product.service'
import { canReadProductOrFail, canWriteProductOrFail } from '../../permission'

@Controller('rest/products')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class ProductController implements ProductREST {
    constructor(
        private readonly productService: ProductService,
        @Inject(REQUEST)
        private readonly request: Request
    ) {}

    @Get()
    @ApiResponse({ type: [Product] })
    async findProducts(): Promise<Product[]> {
        return this.productService.findProducts()
    }

    @Post()
    @ApiBody({ type: ProductAddData, required: true })
    @ApiResponse({ type: Product })
    async addProduct(
        @Body() data: ProductAddData
    ): Promise<Product> {
        return this.productService.addProduct(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Product, })
    async getProduct(
        @Param('id') id: string
    ): Promise<Product> {
        canReadProductOrFail((<User> this.request.user).id, id)
        return this.productService.getProduct(id)
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Product })
    @ApiResponse({ type: Product })
    async updateProduct(
        @Param('id') id: string,
        @Body() data: ProductUpdateData
    ): Promise<Product> {
        canWriteProductOrFail((<User> this.request.user).id, id)
        return this.productService.updateProduct(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Product })
    async deleteProduct(
        @Param('id') id: string
    ): Promise<Product> {
        canWriteProductOrFail((<User> this.request.user).id, id)
        return this.productService.deleteProduct(id)
    }
}