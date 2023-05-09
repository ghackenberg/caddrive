import { Product, ProductAddData, ProductUpdateData, ProductREST, ProductDownMQTT } from 'productboard-common'

import { ProductAPI } from '../clients/mqtt/product'
import { ProductClient } from '../clients/rest/product'
import { AbstractManager } from './abstract'

class ProductManagerImpl extends AbstractManager<Product> implements ProductREST, ProductDownMQTT {
    private findIndex: {[id: string]: boolean}
    
    constructor() {
        super()
        ProductAPI.register(this)
    }

    // CACHE

    override clear() {
        super.clear()
        this.findIndex = undefined
    }

    findProductsFromCache() { 
        if (this.findIndex) { 
            return Object.keys(this.findIndex).map(id => this.getResolveItem(id))
        } else { 
            return undefined 
        } 
    }
    getProductFromCache(productId: string) { 
        return this.getResolveItem(productId)
    }

    private addToFindIndex(product: Product) {
        if (this.findIndex) {
            this.findIndex[product.id] = true
        }
    }
    private removeFromFindIndex(product: Product) {
        if (this.findIndex) {
            delete this.findIndex[product.id]
        }
    }

    // MQTT

    create(product: Product): void {
        product = this.resolveItem(product)
        this.addToFindIndex(product)
    }
    update(product: Product): void {
        product = this.resolveItem(product)
        this.removeFromFindIndex(product)
        this.addToFindIndex(product)
    }
    delete(product: Product): void {
        product = this.resolveItem(product)
        this.removeFromFindIndex(product)
    }

    // REST
    
    async findProducts(): Promise<Product[]> {
        if (!this.findIndex) {
            // Call backend
            let products = await ProductClient.findProducts()
            // Update product index
            products = products.map(product => this.resolveItem(product))
            // Init find index
            this.findIndex = {}
            // Update find index
            products.forEach(product => this.addToFindIndex(product))
        }
        // Return products
        return Object.keys(this.findIndex).map(id => this.getResolveItem(id)).filter(product => !product.deleted)
    }

    async addProduct(data: ProductAddData): Promise<Product> {
        // Call backend
        let product = await ProductClient.addProduct(data)
        // Update product index
        product = this.resolveItem(product)
        // Update product set
        this.addToFindIndex(product)
        // Return product
        return this.getResolveItem(product.id)
    }

    async getProduct(id: string): Promise<Product> {
        if (!this.hasResolveItem(id)) {
            // Call backend
            let product = await ProductClient.getProduct(id)
            // Update product index
            product = this.resolveItem(product)
            // Add to find index
            this.addToFindIndex(product)
        }
        // Return product
        return this.getResolveItem(id)
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        // Call backend
        let product = await ProductClient.updateProduct(id, data)
        // Update product index
        product = this.resolveItem(product)
        // Update find result
        this.removeFromFindIndex(product)
        this.addToFindIndex(product)
        // Return product
        return this.getResolveItem(id)
    }

    async deleteProduct(id: string): Promise<Product> {
        // Call backend
        let product = await ProductClient.deleteProduct(id)
        // Update product index
        product = this.resolveItem(product)
        // Update find result
        this.removeFromFindIndex(product)
        // Return product
        return this.getResolveItem(id)
    }
}

export const ProductManager = new ProductManagerImpl()