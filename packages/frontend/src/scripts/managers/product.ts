import { Product, ProductAddData, ProductUpdateData, ProductREST, ProductDownMQTT } from 'productboard-common'

import { ProductAPI } from '../clients/mqtt/product'
import { ProductClient } from '../clients/rest/product'

class ProductManagerImpl implements ProductREST, ProductDownMQTT {
    private productIndex: {[id: string]: Product} = {}
    private findResult: {[id: string]: boolean}
    
    constructor() {
        ProductAPI.register(this)
    }

    // CACHE

    findProductsFromCache() { 
        if (this.findResult) { 
            return Object.keys(this.findResult).map(id => this.productIndex[id])
        } else { 
            return undefined 
        } 
    }
    getProductFromCache(productId: string) { 
        if (productId in this.productIndex) { 
            return this.productIndex[productId]
        } else { 
            return undefined 
        } 
    }

    private addToFindIndex(product: Product) {
        if (this.findResult) {
            this.findResult[product.id] = true
        }
    }
    private removeFromFindIndex(product: Product) {
        if (this.findResult) {
            delete this.findResult[product.id]
        }
    }

    // MQTT

    create(product: Product): void {
        this.productIndex[product.id] = product
        this.addToFindIndex(product)
    }
    update(product: Product): void {
        this.productIndex[product.id] = product
        this.removeFromFindIndex(product)
        this.addToFindIndex(product)
    }
    delete(product: Product): void {
        this.productIndex[product.id] = product
        this.removeFromFindIndex(product)
    }

    // REST
    
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
        this.addToFindIndex(product)
        // Return product
        return product
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
        this.removeFromFindIndex(product)
        this.addToFindIndex(product)
        // Return product
        return product
    }

    async deleteProduct(id: string): Promise<Product> {
        // Call backend
        const product = await ProductClient.deleteProduct(id)
        // Update product index
        this.productIndex[id] = product
        // Update find result
        this.removeFromFindIndex(product)
        // Return product
        return product
    }
}

export const ProductManager = new ProductManagerImpl()