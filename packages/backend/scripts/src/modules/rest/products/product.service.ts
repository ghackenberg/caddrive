import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'

import shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Product, ProductAddData, ProductUpdateData, ProductREST } from 'productboard-common'
import { Database, ProductEntity } from 'productboard-database'

import { AuthorizedRequest } from '../../../request'

@Injectable({ scope: Scope.REQUEST })
export class ProductService implements ProductREST {
    public constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest,
        @Inject('MQTT')
        private readonly client: ClientProxy
    ) {}
    
    async findProducts() : Promise<Product[]> {
        let where: FindOptionsWhere<ProductEntity>
        if (this.request.user)
            where = { members: [ { userId: this.request.user.id, deleted: null } ], deleted: null }
        else
            where = { public: true, deleted: null }
        const result: Product[] = []
        for (const product of await Database.get().productRepository.find({ where }))
            result.push(this.convert(product))
        return result
    }
    
    async addProduct(data: ProductAddData) {
        // Create product
        const id = shortid()
        const created = Date.now()
        const userId = this.request.user.id
        const product = await Database.get().productRepository.save({ id, created, userId, ...data })
        await this.client.emit(`/api/v1/products/${product.id}/create`, this.convert(product))
        // Create member
        {
            const id = shortid()
            const productId = product.id
            const userId = this.request.user.id
            const role = 'manager'
            /*const member = */await Database.get().memberRepository.save({ id, created, productId, userId, role })
            // TODO await this.client.emit(`/api/v1/members/${member.id}/create`, this.convert(member))
        }
        // Return product
        return this.convert(product)
    }

    async getProduct(id: string): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        return this.convert(product)
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        product.updated = Date.now()
        product.name = data.name
        product.description = data.description
        product.public = data.public
        await Database.get().productRepository.save(product)
        await this.client.emit(`/api/v1/products/${product.id}/update`, this.convert(product))
        return this.convert(product)
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        await Database.get().memberRepository.update({ productId: product.id }, { deleted: Date.now() })
        await Database.get().versionRepository.update({ productId: product.id }, { deleted: Date.now() })
        await Database.get().milestoneRepository.update({ productId: product.id }, { deleted: Date.now() })
        await Database.get().issueRepository.update({ productId: product.id }, { deleted: Date.now() })
        product.deleted = Date.now()
        await Database.get().productRepository.save(product)
        await this.client.emit(`/api/v1/products/${product.id}/delete`, this.convert(product))
        return this.convert(product)
    }

    private convert(product: ProductEntity) {
        return { id: product.id, created: product.created, updated: product.updated, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description, public: product.public }
    }
}