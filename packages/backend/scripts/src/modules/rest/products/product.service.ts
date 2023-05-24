import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Product, ProductAddData, ProductUpdateData, ProductREST } from 'productboard-common'
import { Database, ProductEntity } from 'productboard-database'

import { convertProduct } from '../../../functions/convert'
import { AuthorizedRequest } from '../../../request'

@Injectable({ scope: Scope.REQUEST })
export class ProductService implements ProductREST {
    public constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}
    
    async findProducts(_public: 'true' | 'false') : Promise<Product[]> {
        let where: FindOptionsWhere<ProductEntity> | FindOptionsWhere<ProductEntity>[]
        if (this.request.user)
            if (_public == 'true')
                where = { public: true, deleted: IsNull() }
            else if (_public == 'false')
                where = { public: false, members: [ { userId: this.request.user.id, deleted: IsNull() } ], deleted: IsNull() }
            else
                where = [
                    { public: true, deleted: IsNull() },
                    { public: false, members: [ { userId: this.request.user.id, deleted: IsNull() } ], deleted: IsNull() }
                ]
        else
            if (_public == 'true')
                where = { public: true, deleted: IsNull() }
            else if (_public == 'false')
                return []
            else
                where = { public: true, deleted: IsNull() }
        const result: Product[] = []
        for (const product of await Database.get().productRepository.find({ where, order: { updated: 'DESC' }, take: 50 }))
            result.push(convertProduct(product))
        return result
    }
    
    async addProduct(data: ProductAddData) {
        // Create product
        const productId = shortid()
        const created = Date.now()
        const updated = created
        const userId = this.request.user.id
        const product = await Database.get().productRepository.save({ id: productId, created, updated, userId, ...data })
        // Create member
        const memberId = shortid()
        const role = 'manager'
        await Database.get().memberRepository.save({ id: memberId, created, updated, productId, userId, role })
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
        return convertProduct(product)
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await Database.get().productRepository.findOneByOrFail({ id })
        product.deleted = Date.now()
        product.updated = product.deleted
        await Database.get().memberRepository.update({ productId: product.id }, { deleted: product.deleted, updated: product.updated })
        await Database.get().versionRepository.update({ productId: product.id }, { deleted: product.deleted, updated: product.updated })
        await Database.get().milestoneRepository.update({ productId: product.id }, { deleted: product.deleted, updated: product.updated })
        await Database.get().issueRepository.update({ productId: product.id }, { deleted: product.deleted, updated: product.updated })
        for (const issue of await Database.get().issueRepository.findBy({ productId: product.id })) {
            await Database.get().commentRepository.update({ issueId: issue.id }, { deleted: product.deleted, updated: product.updated })
        }
        await Database.get().productRepository.save(product)
        return convertProduct(product)
    }
}