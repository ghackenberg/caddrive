import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import * as shortid from 'shortid'
import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { ProductEntity } from './product.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { VersionEntity } from '../versions/version.entity'
import { IssueEntity } from '../issues/issue.entity'
import { MemberEntity } from '../members/member.entity'
import { MilestoneEntity } from '../milestones/milestone.entity'

@Injectable({ scope: Scope.REQUEST })
export class ProductService implements ProductREST {
    private static readonly products: Product[] = [
        { id: 'demo-1', userId: 'demo-1', name: 'Lego Buggy', description: 'The Lego Buggy is a toy for children and adults of all sizes.', deleted: false },
        { id: 'demo-2', userId: 'demo-2', name: '2 Cylinder Engine', description: 'The 2 Cylinder Engine is a motor for applications of all sizes.', deleted: false }
    ]

    public constructor(
        @Inject(REQUEST)
        private readonly request: Express.Request,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository <ProductEntity>,
        @InjectRepository(VersionEntity)
        private readonly versionRepository: Repository <VersionEntity>,
        @InjectRepository(IssueEntity)
        private readonly issueRepository: Repository <IssueEntity>,
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository <MemberEntity>,
        @InjectRepository(MilestoneEntity)
        private readonly milestoneRepository: Repository <MilestoneEntity>,
        ) {
            this.productRepository.count().then(async count => {
                if (count == 0) {
                    for (const product of ProductService.products) {
                        await this.productRepository.save(product)
                    }
                }
            })
        }
    
    async findProducts() : Promise<Product[]> {
        const result: Product[] = []
        const where = { deleted: false }
        for (const product of await this.productRepository.find({ where })) {
            if ((await this.memberRepository.find({ productId: product.id, userId: (<User> (<any> this.request).user).id })).length == 0) {
                continue
            }
            result.push({ id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description })
        }
        return result
    }
    

    async addProduct(data: ProductAddData) {
        const product = await this.productRepository.save({ id: shortid(), deleted: false, ...data })
        await this.memberRepository.save({ id: shortid(), productId: product.id, userId: product.userId })
        return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
    }

    async getProduct(id: string): Promise<Product> {
        const product = await this.productRepository.findOne(id)
        if(product) {
            return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
        }
        throw new NotFoundException()
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        const product = await this.productRepository.findOne(id)
        if (product) {
            product.name = data.name
            product.description = data.description
            await this.productRepository.save(product)
            return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
        }
        throw new NotFoundException()
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await this.productRepository.findOne(id)
        if (product) {
            for (const version of await this.versionRepository.find({ productId: product.id})) {
                version.deleted = true
                this.versionRepository.save(version)
            }
            for (const issue of await this.issueRepository.find({ productId: product.id })) {
                issue.deleted = true
                this.issueRepository.save(issue)
            }
            for (const milestone of await this.milestoneRepository.find({ productId: product.id })) {
                milestone.deleted = true
                this.milestoneRepository.save(milestone)
            }
            for (const member of await this.memberRepository.find({ productId: product.id })) {
                member.deleted = true
                this.memberRepository.save(member)
            }
            product.deleted = true
            await this.productRepository.save(product)
            return { id: product.id, deleted: product.deleted, userId: product.userId, name: product.name, description: product.description }
        }
        throw new NotFoundException()
    }
}