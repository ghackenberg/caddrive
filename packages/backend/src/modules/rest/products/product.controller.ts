import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBody, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger'

import { Request } from 'express'

import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'

import { canReadProductOrFail, canUpdateProductOrFail, canDeleteProductOrFail, canCreateProductOrFail } from '../../../functions/permission'
import { AuthGuard } from '../users/auth.guard'
import { ProductService } from './product.service'

@Controller('rest/products')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProductController implements ProductREST {
    constructor(
        private readonly productService: ProductService,
        @Inject(REQUEST)
        private readonly request: Request & { user: User }
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
        await canCreateProductOrFail(this.request.user)
        return this.productService.addProduct(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Product, })
    async getProduct(
        @Param('id') id: string
    ): Promise<Product> {
        await canReadProductOrFail(this.request.user, id)
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
        await canUpdateProductOrFail(this.request.user, id)
        return this.productService.updateProduct(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Product })
    async deleteProduct(
        @Param('id') id: string
    ): Promise<Product> {
        await canDeleteProductOrFail(this.request.user, id)
        return this.productService.deleteProduct(id)
    }
}