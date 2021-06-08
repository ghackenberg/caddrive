import { Injectable } from '@nestjs/common'
import { Product } from 'fhooe-audit-platform-common'

@Injectable()
export class ProductService {
    private readonly products: Product[] = []

    async findAll() {
        return this.products
    }
}