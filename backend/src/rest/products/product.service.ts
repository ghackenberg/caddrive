import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { Product, ProductREST } from 'fhooe-audit-platform-common'

@Injectable()
export class ProductService implements ProductREST {
    private readonly products: Product[] = []

    constructor() {
        for (var i = 0; i < Math.random() * 20; i++) {
            this.products.push({
                id: shortid()
            })
        }
    }

    async findAll() {
        return this.products
    }

    async addProduct(product: Product) {
        this.products.push(product)
        
        return product
    }

    async updateProduct(product: Product) {
        
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].id == product.id)
                this.products.splice(i,1,product)
        }

        return product
    }
}