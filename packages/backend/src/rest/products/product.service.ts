import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import * as shortid from 'shortid'
import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { VersionService } from '../versions/version.service'
import { IssueService } from '../issues/issue.service'
import { MemberService } from '../members/member.service'
import { MilestoneService } from '../milestones/milestone.service'
import { ProductEntity } from './product.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable({ scope: Scope.REQUEST })
export class ProductService implements ProductREST {
    private static readonly products: Product[] = [
        { id: 'demo-1', userId: 'demo-1', name: 'Lego Buggy', description: 'The Lego Buggy is a toy for children and adults of all sizes.', deleted: false },
        { id: 'demo-2', userId: 'demo-2', name: '2 Cylinder Engine', description: 'The 2 Cylinder Engine is a motor for applications of all sizes.', deleted: false }
    ]

    public constructor(
        private readonly versionService: VersionService,
        private readonly issueService: IssueService,
        private readonly memberService: MemberService,
        private readonly milestoneService: MilestoneService,
        @Inject(REQUEST)
        private readonly request: Express.Request,
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository <ProductEntity>
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
        const results: Product[] = []
        const options = { deleted: false }
        for (const product of await this.productRepository.find(options)) {
            if ((await this.memberService.findMembers(product.id, (<User> (<any> this.request).user).id)).length == 0) {
                continue
            }
            results.push(product)
        }
        return results
    }

    async addProduct(data: ProductAddData) {
        const product = { id: shortid(), deleted: false, ...data }
        this.productRepository.save(product)
        this.memberService.addMember({productId: product.id, userId: product.userId})
        return product
    }

    async getProduct(id: string): Promise<Product> {
        const product = this.productRepository.findOne(id)
        if(product) {
            return product
        }
        throw new NotFoundException()
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        const product = await this.productRepository.findOne(id)
        if (product) {
            product.name = data.name
            product.description = data.description
            return this.productRepository.save(product)
        }
        throw new NotFoundException()
    }

    async deleteProduct(id: string): Promise<Product> {
        for (const product of ProductService.products) {
            if (product.id == id) {
                for (const version of await this.versionService.findVersions(id)) {
                    await this.versionService.deleteVersion(version.id)
                }
                for (const issue of await this.issueService.findIssues(id)) {
                    await this.issueService.deleteIssue(issue.id)
                }
                for (const milestone of await this.milestoneService.findMilestones(id)) {
                    await this.milestoneService.deleteMilestone(milestone.id)
                }
                for (const member of await this.memberService.findMembers(id)) {
                    await this.memberService.deleteMember(member.id)
                }

            }
        }
        //DB
        const product = await this.productRepository.findOne(id)
        if(product) {
            product.deleted = true
            return this.productRepository.save(product)
        }
        throw new NotFoundException()
    }
}