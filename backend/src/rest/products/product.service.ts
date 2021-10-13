import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { Product, ProductData, ProductREST } from 'fhooe-audit-platform-common'

@Injectable()
export class ProductService implements ProductREST {
    private products: Product[] = [{name: 'Maschine A', id: 'TestProduct'}]

    async addProduct(data: ProductData) {
        const product = { id: shortid(), ...data }

        this.products.push(product)
        
        return product
    }

    async deleteProduct(product: Product): Promise<Product[]> {
        this.products = this.products.filter(products => products.id != product.id)
        return this.products
    }

    async findProducts(name?: string) : Promise<Product[]> {
        
        const result: Product[] = []

        name = name ? name.toLowerCase() : undefined

        for (var index = 0; index < this.products.length; index++) {
            const product = this.products[index]

            if (name && !product.name.toLowerCase().includes(name)) {
                continue
            }

            result.push(product)
        }

        return result
    }

    async getProduct(id: string): Promise<Product> {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].id == id)
                return this.products[i]
        }
        return null
    }

    async updateProduct(product: Product): Promise<Product> {
        
        for (var i = 0; i < this.products.length; i++) {

            if (this.products[i].id == product.id &&
                    this.products[i].name != product.name) {
                        
                this.products.splice(i,1,product)
            }
        }

        return product
    }
}