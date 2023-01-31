import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'

import { Request } from 'express'
import * as shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { Database, ProductEntity } from 'productboard-database'

@Injectable({ scope: Scope.REQUEST })
export class ProductService implements ProductREST {
    public constructor(
        @Inject(REQUEST)
        private readonly request: Request & { user: User & { permissions: string[] }},
        @Inject('MQTT')
        private readonly client: ClientProxy
    ) {}
    
    async findProducts() : Promise<Product[]> {
        let where: FindOptionsWhere<ProductEntity>
        if (this.request.user)
            where = { members: [ { userId: this.request.user.id, deleted: false } ], deleted: false }
        else
            where = { public: true, deleted: false }
        const result: Product[] = []
        for (const product of await Database.get().productRepository.find({ where }))
            result.push(this.convert(product))
        return result
    }
    
    async addProduct(data: ProductAddData) {
        const product = await Database.get().productRepository.save({ id: shortid(), deleted: false, ...data })
        await Database.get().memberRepository.save({ id: shortid(), productId: product.id, userId: product.userId, role: 'manager' })
        await this.client.emit(`/api/v1/products/${product.id}/create`, this.convert(product))
        return this.convert(product)
    }

    async getProduct(id: string): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        return this.convert(product)
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        product.name = data.name
        product.description = data.description
        product.public = data.public
        await Database.get().productRepository.save(product)
        await this.client.emit(`/api/v1/products/${product.id}/update`, this.convert(product))
        return this.convert(product)
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        await Database.get().memberRepository.update({ productId: product.id }, { deleted: true })
        await Database.get().versionRepository.update({ productId: product.id }, { deleted: true })
        await Database.get().milestoneRepository.update({ productId: product.id }, { deleted: true })
        await Database.get().issueRepository.update({ productId: product.id }, { deleted: true })
        product.deleted = true
        await Database.get().productRepository.save(product)
        await this.client.emit(`/api/v1/products/${product.id}/delete`, this.convert(product))
        return this.convert(product)
    }

    private convert(product: ProductEntity) {
        return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description, public: product.public }
    }
}