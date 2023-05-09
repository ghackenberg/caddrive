import { Product, ProductAddData, ProductUpdateData, ProductREST } from 'productboard-common'

import { ProductClient } from '../clients/rest/product'
import { AbstractManager } from './abstract'

class ProductManagerImpl extends AbstractManager<Product> implements ProductREST {
    // CACHE

    findProductsFromCache() {
        return this.getFind('')
    }
    getProductFromCache(productId: string) { 
        return this.getItem(productId)
    }

    // REST
    
    async findProducts() {
        return this.find(
            '',
            () => ProductClient.findProducts(),
            () => true
        )
    }
    async addProduct(data: ProductAddData) {
        return this.add(ProductClient.addProduct(data))
    }
    async getProduct(id: string) {
        return this.get(id, () => ProductClient.getProduct(id))
    }
    async updateProduct(id: string, data: ProductUpdateData) {
        return this.update(id, ProductClient.updateProduct(id, data))
    }
    async deleteProduct(id: string) {
        return this.delete(id, ProductClient.deleteProduct(id))
    }
}

export const ProductManager = new ProductManagerImpl()