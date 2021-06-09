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
}