import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { Product, ProductData, ProductREST } from 'fhooe-audit-platform-common'
import { VersionService } from '../versions/version.service'

@Injectable()
export class ProductService implements ProductREST {
    private static readonly products: Product[] = [
        { id: 'demo', name: 'Demo Product' }
    ]

    public constructor(
        @Inject(forwardRef(() => VersionService))
        private readonly versionService: VersionService,
    ) {}

    async findProducts(quick?: string, name?: string) : Promise<Product[]> {
        const result: Product[] = []

        quick = quick ? quick.toLowerCase() : undefined
        name = name ? name.toLowerCase() : undefined

        for (const product of ProductService.products) {
            if (quick) {
                const conditionA = product.name.toLowerCase().includes(quick)

                if (!(conditionA)) {
                    continue
                }
            }
            if (name && !product.name.toLowerCase().includes(name)) {
                continue
            }
            
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
                for (const version of await this.versionService.findVersions(null, null, id)) {
                    await this.versionService.deleteVersion(version.id)
                }
                ProductService.products.splice(index, 1)
                return product
            }
        }
        throw new NotFoundException()
    }
}