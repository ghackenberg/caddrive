import { Product, ProductAddData, ProductUpdateData } from 'productboard-common'

import { ProductClient } from '../clients/rest/product'
import { AbstractManager } from './abstract'

class ProductManagerImpl extends AbstractManager<Product> {
    // CACHE

    findProductsFromCache() {
        return this.getFind('')
    }
    getProductFromCache(productId: string) { 
        return this.getItem(productId)
    }

    // REST
    
    findProducts(callback: (products: Product[], error?: string) => void) {
        return this.find(
            '',
            () => ProductClient.findProducts(),
            () => true,
            callback
        )
    }
    async addProduct(data: ProductAddData) {
        return this.add(ProductClient.addProduct(data))
    }
    getProduct(id: string, callback: (product: Product, error?: string) => void) {
        return this.get(id, () => ProductClient.getProduct(id), callback)
    }
    async updateProduct(id: string, data: ProductUpdateData) {
        return this.update(id, ProductClient.updateProduct(id, data))
    }
    async deleteProduct(id: string) {
        return this.delete(id, ProductClient.deleteProduct(id))
    }
}

export const ProductManager = new ProductManagerImpl()