import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBody, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'

import { ProductCreate, ProductREST, ProductRead, ProductUpdate } from 'productboard-common'

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
    @ApiResponse({ type: [ProductRead] })
    async findProducts(
        @Query('public') _public: 'true' | 'false'
    ): Promise<ProductRead[]> {
        return this.productService.findProducts(_public)
    }

    @Post()
    @ApiBody({ type: ProductCreate, required: true })
    @ApiResponse({ type: ProductRead })
    async addProduct(
        @Body() data: ProductCreate
    ): Promise<ProductRead> {
        await canCreateProductOrFail(this.request.user)
        return this.productService.addProduct(data)
    }

    @Get(':productId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: ProductRead, })
    async getProduct(
        @Param('productId') productId: string
    ): Promise<ProductRead> {
        await canReadProductOrFail(this.request.user, productId)
        return this.productService.getProduct(productId)
    }

    @Put(':productId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiBody({ type: ProductUpdate })
    @ApiResponse({ type: ProductRead })
    async updateProduct(
        @Param('productId') productId: string,
        @Body() data: ProductUpdate
    ): Promise<ProductRead> {
        await canUpdateProductOrFail(this.request.user, productId)
        return this.productService.updateProduct(productId, data)
    }

    @Delete(':productId')
    @ApiParam({ name: 'productId', type: 'string', required: true })
    @ApiResponse({ type: ProductRead })
    async deleteProduct(
        @Param('productId') productId: string
    ): Promise<ProductRead> {
        await canDeleteProductOrFail(this.request.user, productId)
        return this.productService.deleteProduct(productId)
    }
}