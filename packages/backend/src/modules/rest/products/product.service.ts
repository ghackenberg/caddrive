import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Client, ClientProxy, Transport } from '@nestjs/microservices'

import { Request } from 'express'
import * as shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { CommentRepository, IssueRepository, MemberRepository, MilestoneRepository, ProductEntity, ProductRepository, VersionRepository } from 'productboard-database'

@Injectable({ scope: Scope.REQUEST })
export class ProductService implements ProductREST {
    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    public constructor(
        @Inject(REQUEST)
        private readonly request: Request,
    ) {}
    
    async findProducts() : Promise<Product[]> {
        let where: FindOptionsWhere<ProductEntity>
        // eslint-disable-next-line no-constant-condition
        if (true)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            where = { members: [ { userId: (<User> (<any> this.request).user).id, deleted: false } ], deleted: false }
        const result: Product[] = []
        for (const product of await ProductRepository.find({ where }))
            result.push(this.convert(product))
        return result
    }
    
    async addProduct(data: ProductAddData) {
        const product = await ProductRepository.save({ id: shortid(), deleted: false, ...data })
        await MemberRepository.save({ id: shortid(), productId: product.id, userId: product.userId, role: 'manager' })
        await this.client.emit(`/api/v1/products/${product.id}/create`, this.convert(product))
        return this.convert(product)
    }

    async getProduct(id: string): Promise<Product> {
        const product = await ProductRepository.findOneByOrFail({ id })
        return this.convert(product)
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        const product = await ProductRepository.findOneByOrFail({ id })
        product.name = data.name
        product.description = data.description
        await ProductRepository.save(product)
        await this.client.emit(`/api/v1/products/${product.id}/update`, this.convert(product))
        return this.convert(product)
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await ProductRepository.findOneByOrFail({ id })
        await MemberRepository.update({ productId: product.id }, { deleted: true })
        await VersionRepository.update({ productId: product.id }, { deleted: true })
        await MilestoneRepository.update({ productId: product.id }, { deleted: true })
        await IssueRepository.update({ productId: product.id }, { deleted: true })
        await CommentRepository.update({ issue: { productId: product.id } }, { deleted: true })
        product.deleted = true
        await ProductRepository.save(product)
        await this.client.emit(`/api/v1/products/${product.id}/delete`, this.convert(product))
        return this.convert(product)
    }

    private convert(product: ProductEntity) {
        return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
    }
}