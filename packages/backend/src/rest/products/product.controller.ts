import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiResponse, ApiParam, ApiBasicAuth } from '@nestjs/swagger'
import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { MemberRepository, ProductRepository } from 'productboard-database'
import { ProductService } from './product.service'

@Controller('rest/products')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class ProductController implements ProductREST {
    constructor(
        private readonly productService: ProductService,
        @Inject(REQUEST)
        private readonly request: Express.Request
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
        const product = await ProductRepository.findOneByOrFail({ id })
        try {
            await MemberRepository.findOneByOrFail({ productId: product.id, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return product
    }

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Product })
    @ApiResponse({ type: Product })
    async updateProduct(
        @Param('id') id: string,
        @Body() data: ProductUpdateData
    ): Promise<Product> {
        const product = await ProductRepository.findOneByOrFail({ id })
        try {
            await MemberRepository.findOneByOrFail({ productId: product.id, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.productService.updateProduct(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Product })
    async deleteProduct(
        @Param('id') id: string
    ): Promise<Product> {
        const product = await ProductRepository.findOneByOrFail({ id })
        try {
            await MemberRepository.findOneByOrFail({ productId: product.id, userId: (<User> this.request.user).id, deleted: false })
        } catch (error) {
            throw new ForbiddenException()
        }
        return this.productService.deleteProduct(id)
    }
}