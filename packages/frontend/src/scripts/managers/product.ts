import { Product, ProductAddData, ProductUpdateData, ProductREST } from 'productboard-common'

import { ProductClient } from '../clients/rest/product'

class ProductManagerImpl implements ProductREST {
    private productIndex: {[id: string]: Product} = {}
    private findResult: {[id: string]: boolean}

    findProductsFromCache() { 
        if (this.findResult) { 
            return Object.keys(this.findResult).map(id => this.productIndex[id])
        } else { 
            return undefined 
        } 
    }
    
    async findProducts(): Promise<Product[]> {
        if (!this.findResult) {
            // Call backend
            const products = await ProductClient.findProducts()
            // Update product index
            for (const product of products) {
                this.productIndex[product.id] = product
            }
            // Update product set
            this.findResult = {}
            for (const product of products) {
                this.findResult[product.id] = true
            }
        }
        // Return products
        return Object.keys(this.findResult).map(id => this.productIndex[id])
    }

    async addProduct(data: ProductAddData): Promise<Product> {
        // Call backend
        const product = await ProductClient.addProduct(data)
        // Update product index
        this.productIndex[product.id] = product
        // Update product set
        this.addToFindResult(product)
        // Return product
        return product
    }

    getProductFromCache(productId: string) { 
        if (productId in this.productIndex) { 
            return this.productIndex[productId]
        } else { 
            return undefined 
        } 
    }

    async getProduct(id: string): Promise<Product> {
        if (!(id in this.productIndex)) {
            // Call backend
            const product = await ProductClient.getProduct(id)
            // Update product index
            this.productIndex[id] = product
        }
        // Return product
        return this.productIndex[id]
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        // Call backend
        const product = await ProductClient.updateProduct(id, data)
        // Update product index
        this.productIndex[id] = product
        // Update find result
        this.removeFromFindResult(product)
        this.addToFindResult(product)
        // Return product
        return product
    }

    async deleteProduct(id: string): Promise<Product> {
        // Call backend
        const product = await ProductClient.deleteProduct(id)
        // Update product index
        this.productIndex[id] = product
        // Update find result
        this.removeFromFindResult(product)
        // Return product
        return product
    }

    private addToFindResult(product: Product) {
        if (this.findResult) {
            this.findResult[product.id] = true
        }
    }
    
    private removeFromFindResult(product: Product) {
        if (this.findResult) {
            delete this.findResult[product.id]
        }
    }
}

export const ProductManager = new ProductManagerImpl()