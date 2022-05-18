import { Body, Controller, Delete, ForbiddenException, Get, Inject, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ApiBody, ApiResponse, ApiParam, ApiBasicAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { getMemberOrFail, getProductOrFail, getUserOrFail } from 'productboard-database'
import { ProductService } from './product.service'

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
        const product = await getProductOrFail({ id, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id, userId: user.id, deleted: false }, ForbiddenException)
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
        const product = await getProductOrFail({ id, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id, userId: user.id, deleted: false }, ForbiddenException)
        return this.productService.updateProduct(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Product })
    async deleteProduct(
        @Param('id') id: string
    ): Promise<Product> {
        const product = await getProductOrFail({ id, deleted: false }, NotFoundException)
        const user = await getUserOrFail({ id: (<User> this.request.user).id, deleted: false }, NotFoundException)
        await getMemberOrFail({ productId: product.id, userId: user.id, deleted: false }, ForbiddenException)
        return this.productService.deleteProduct(id)
    }
}