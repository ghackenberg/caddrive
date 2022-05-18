import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import * as shortid from 'shortid'
import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { IssueRepository, MemberRepository, MilestoneRepository, ProductRepository, VersionRepository } from 'productboard-database'

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
            if ((await MemberRepository.find({ where: { productId: product.id, userId: (<User> (<any> this.request).user).id } })).length == 0) {
                continue
            }
            result.push({ id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description })
        }
        return result
    }
    

    async addProduct(data: ProductAddData) {
        const product = await ProductRepository.save({ id: shortid(), deleted: false, ...data })
        await MemberRepository.save({ id: shortid(), productId: product.id, userId: product.userId })
        return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
    }

    async getProduct(id: string): Promise<Product> {
        const product = await ProductRepository.findOne({ where: { id } })
        if(product) {
            return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
        }
        throw new NotFoundException()
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        const product = await ProductRepository.findOne({ where: { id } })
        if (product) {
            product.name = data.name
            product.description = data.description
            await ProductRepository.save(product)
            return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
        }
        throw new NotFoundException()
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await ProductRepository.findOne({ where: { id } })
        if (product) {
            for (const version of await VersionRepository.find({ where: { productId: product.id } })) {
                version.deleted = true
                VersionRepository.save(version)
            }
            for (const issue of await IssueRepository.find({ where: { productId: product.id } })) {
                issue.deleted = true
                IssueRepository.save(issue)
            }
            for (const milestone of await MilestoneRepository.find({ where: { productId: product.id } })) {
                milestone.deleted = true
                MilestoneRepository.save(milestone)
            }
            for (const member of await MilestoneRepository.find({ where: { productId: product.id } })) {
                member.deleted = true
                MemberRepository.save(member)
            }
            product.deleted = true
            await ProductRepository.save(product)
            return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
        }
        throw new NotFoundException()
    }
}