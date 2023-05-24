import { Product, ProductAddData, ProductUpdateData } from 'productboard-common'

import { ProductClient } from '../clients/rest/product'
import { AbstractManager } from './abstract'

class ProductManagerImpl extends AbstractManager<Product> {
    // CACHE

    findProductsFromCache(_public: 'true' | 'false') {
        return this.getFind(`${_public}`)
    }
    getProductFromCache(productId: string) { 
        return this.getItem(productId)
    }

    // REST
    
    findProducts(_public: 'true' | 'false', callback: (products: Product[], error?: string) => void) {
        return this.find(
            `${_public}`,
            () => ProductClient.findProducts(_public),
            product => _public === undefined || product.public == (_public == 'true'),
            (a, b) => a.updated - b.updated,
            callback
        )
    }
    async addProduct(data: ProductAddData) {
        return this.resolveItem(await ProductClient.addProduct(data))
    }
    getProduct(id: string, callback: (product: Product, error?: string) => void) {
        return this.observeItem(id, () => ProductClient.getProduct(id), callback)
    }
    async updateProduct(id: string, data: ProductUpdateData) {
        return this.promiseItem(id, ProductClient.updateProduct(id, data))
    }
    async deleteProduct(id: string) {
        return this.promiseItem(id, ProductClient.deleteProduct(id))
    }
}

export const ProductManager = new ProductManagerImpl('product')