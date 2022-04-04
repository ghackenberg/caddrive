import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import * as shortid from 'shortid'
import { Product, ProductAddData, ProductUpdateData, ProductREST, User } from 'productboard-common'
import { VersionService } from '../versions/version.service'
import { IssueService } from '../issues/issue.service'
import { MemberService } from '../members/member.service'

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
        @Inject(REQUEST)
        private readonly request: Express.Request
    ) {}

    async findProducts() : Promise<Product[]> {
        const result: Product[] = []
        for (const product of ProductService.products) {
            if(product.deleted) {
                continue
            }
            if ((await this.memberService.findMembers(product.id, (<User> (<any> this.request).user).id)).length == 0) {
                continue
            }
            result.push(product)
        }
        return result
    }

    async addProduct(data: ProductAddData) {
        const product = { id: shortid(), deleted: false, ...data }
        ProductService.products.push(product)
        this.memberService.addMember({productId: product.id, userId: product.userId})
        return product
    }

    async getProduct(id: string): Promise<Product> {
        for (const product of ProductService.products) {
            if (product.id == id) {
                return product
            }
        }
        throw new NotFoundException()
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        for (var index = 0; index < ProductService.products.length; index++) {
            const product = ProductService.products[index]
            if (product.id == id) {
                ProductService.products.splice(index, 1, { ...product, ...data })
                return ProductService.products[index]
            }
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
                for (const member of await this.memberService.findMembers(id)) {
                    await this.memberService.deleteMember(member.id)
                }
                product.deleted = true
                return product
            }
        }
        throw new NotFoundException()
    }
}