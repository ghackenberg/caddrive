import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import * as shortid from 'shortid'
import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { IssueRepository, MemberRepository, MilestoneRepository, ProductEntity, ProductRepository, VersionRepository } from 'productboard-database'

@Injectable({ scope: Scope.REQUEST })
export class ProductService implements ProductREST {
    public constructor(
        @Inject(REQUEST)
        private readonly request: Express.Request,
    ) {}
    
    async findProducts() : Promise<Product[]> {
        const result: Product[] = []
        const where = { deleted: false }
        for (const product of await ProductRepository.find({ where })) {
            try {
                await MemberRepository.findOneByOrFail({ productId: product.id, userId: (<User> (<any> this.request).user).id, deleted: false })
                result.push(this.convert(product))
            } catch (error) {
                // Ignore
            }
        }
        return result
    }
    

    async addProduct(data: ProductAddData) {
        const product = await ProductRepository.save({ id: shortid(), deleted: false, ...data })
        await MemberRepository.save({ id: shortid(), productId: product.id, userId: product.userId })
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
        return this.convert(product)
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await ProductRepository.findOneByOrFail({ id })
        await MemberRepository.update({ productId: product.id }, { deleted: true })
        await VersionRepository.update({ productId: product.id }, { deleted: true })
        await MilestoneRepository.update({ productId: product.id }, { deleted: true })
        await IssueRepository.update({ productId: product.id }, { deleted: true })
        // TODO Delete comments
        product.deleted = true
        await ProductRepository.save(product)
        return this.convert(product)
    }

    private convert(product: ProductEntity) {
        return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
    }
}