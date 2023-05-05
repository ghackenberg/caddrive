import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Product, ProductAddData, ProductUpdateData, ProductREST } from 'productboard-common'
import { Database, ProductEntity } from 'productboard-database'

import { convertMember, convertProduct } from '../../../functions/convert'
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
        let where: FindOptionsWhere<ProductEntity> | FindOptionsWhere<ProductEntity>[]
        if (this.request.user)
            where = [
                { members: [ { userId: this.request.user.id, deleted: IsNull() } ], deleted: IsNull() },
                { public: true, deleted: IsNull() }
            ]
        else
            where = { public: true, deleted: IsNull() }
        const result: Product[] = []
        for (const product of await Database.get().productRepository.find({ where }))
            result.push(convertProduct(product))
        console.log(result)
        return result
    }
    
    async addProduct(data: ProductAddData) {
        // Create product
        const productId = shortid()
        const created = Date.now()
        const userId = this.request.user.id
        const product = await Database.get().productRepository.save({ id: productId, created, userId, ...data })
        await this.client.emit(`/api/v1/products/${product.id}/create`, convertProduct(product))
        // Create member
        const memberId = shortid()
        const role = 'manager'
        const member = await Database.get().memberRepository.save({ id: memberId, created, productId, userId, role })
        await this.client.emit(`/api/v1/members/${member.id}/create`, convertMember(member))
        // Return product
        return convertProduct(product)
    }

    async getProduct(id: string): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        return convertProduct(product)
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        product.updated = Date.now()
        product.name = data.name
        product.description = data.description
        product.public = data.public
        await Database.get().productRepository.save(product)
        await this.client.emit(`/api/v1/products/${product.id}/update`, convertProduct(product))
        return convertProduct(product)
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        await Database.get().memberRepository.update({ productId: product.id }, { deleted: Date.now() })
        await Database.get().versionRepository.update({ productId: product.id }, { deleted: Date.now() })
        await Database.get().milestoneRepository.update({ productId: product.id }, { deleted: Date.now() })
        await Database.get().issueRepository.update({ productId: product.id }, { deleted: Date.now() })
        product.deleted = Date.now()
        await Database.get().productRepository.save(product)
        await this.client.emit(`/api/v1/products/${product.id}/delete`, convertProduct(product))
        return convertProduct(product)
    }
}