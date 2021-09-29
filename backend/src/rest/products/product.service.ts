import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { Product, ProductData, ProductREST } from 'fhooe-audit-platform-common'

@Injectable()
export class ProductService implements ProductREST {
    private products: Product[] = []

    constructor() {
        for (var i = 0; i < Math.random() * 20; i++) {
            this.products.push({
                id: shortid(),
                name: shortid()
            })
        }
    }

    async findProducts(name?: string) : Promise<Product[]> {
        
        const productsQuery: Product[] = []

        const productsNameLower = this.products.map(product => product.name.toLowerCase())

        for (var i = 0; i < productsNameLower.length; i++) {

            if (!name || productsNameLower[i].includes(name.toLowerCase())) {
                productsQuery.push(this.products[i])
            }
        }

        return productsQuery
    }

    async getProduct(id: string): Promise<Product> {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].id == id)
                return this.products[i]
        }
        return null
    }

    async addProduct(data: ProductData) {
        const product = { id: shortid(), ...data }

        this.products.push(product)
        
        return product
    }

    async updateProduct(product: Product) {
        
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].id == product.id &&
                this.products[i].name == product.name) {

                this.products = this.products.filter(products => products.id != product.id)
            }
            else if (this.products[i].id == product.id &&
                    this.products[i].name != product.name) {
                        
                this.products.splice(i,1,product)
            }
        }

        return product
    }
}