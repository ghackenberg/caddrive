import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { Product, ProductData, ProductREST } from 'fhooe-audit-platform-common'
import { VersionService } from '../versions/version.service'

@Injectable()
export class ProductService implements ProductREST {
    private static readonly products: Product[] = [
        { id: 'demo', userId: 'demo', name: 'Demo Product', description: 'This product demonstrates the capabilities of ProductBoard.' }
    ]

    public constructor(
        private readonly versionService: VersionService,
    ) {}

    async findProducts() : Promise<Product[]> {
        const result: Product[] = []

        for (const product of ProductService.products) {
            result.push(product)
        }

        return result
    }

    async addProduct(data: ProductData) {
        const product = { id: shortid(), ...data }
        ProductService.products.push(product)
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

    async updateProduct(id: string, data: ProductData): Promise<Product> {
        for (var index = 0; index < ProductService.products.length; index++) {
            const product = ProductService.products[index]
            if (product.id == id) {
                ProductService.products.splice(index, 1, { id, ...data })
                return ProductService.products[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteProduct(id: string): Promise<Product> {
        for (var index = 0; index < ProductService.products.length; index++) {
            const product = ProductService.products[index]
            if (product.id == id) {
                for (const version of await this.versionService.findVersions(id)) {
                    await this.versionService.deleteVersion(version.id)
                }
                ProductService.products.splice(index, 1)
                return product
            }
        }
        throw new NotFoundException()
    }
}