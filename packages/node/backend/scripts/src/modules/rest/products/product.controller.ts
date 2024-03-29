import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBody, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

import { Product, ProductAddData, ProductUpdateData, ProductREST } from 'productboard-common'

import { ProductService } from './product.service'
import { canReadProductOrFail, canUpdateProductOrFail, canDeleteProductOrFail, canCreateProductOrFail } from '../../../functions/permission'
import { AuthorizedRequest } from '../../../request'
import { TokenOptionalGuard } from '../tokens/token.guard'

@Controller('rest/products')
@UseGuards(TokenOptionalGuard)
@ApiBearerAuth()
export class ProductController implements ProductREST {
    constructor(
        private readonly productService: ProductService,
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    @Get()
    @ApiQuery({ name: 'public', type: 'boolean', required: false })
    @ApiResponse({ type: [Product] })
    async findProducts(
        @Query('public') _public: 'true' | 'false'
    ): Promise<Product[]> {
        return this.productService.findProducts(_public)
    }

    @Post()
    @ApiBody({ type: ProductAddData, required: true })
    @ApiResponse({ type: Product })
    async addProduct(
        @Body() data: ProductAddData
    ): Promise<Product> {
        await canCreateProductOrFail(this.request.user && this.request.user.userId)
        return this.productService.addProduct(data)
    }

    @Get(':productId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: Product, })
    async getProduct(
        @Param('productId') productId: string
    ): Promise<Product> {
        await canReadProductOrFail(this.request.user && this.request.user.userId, productId)
        return this.productService.getProduct(productId)
    }

    @Put(':productId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiBody({ type: Product })
    @ApiResponse({ type: Product })
    async updateProduct(
        @Param('productId') productId: string,
        @Body() data: ProductUpdateData
    ): Promise<Product> {
        await canUpdateProductOrFail(this.request.user && this.request.user.userId, productId)
        return this.productService.updateProduct(productId, data)
    }

    @Delete(':productId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: Product })
    async deleteProduct(
        @Param('productId') productId: string
    ): Promise<Product> {
        await canDeleteProductOrFail(this.request.user && this.request.user.userId, productId)
        return this.productService.deleteProduct(productId)
    }
}