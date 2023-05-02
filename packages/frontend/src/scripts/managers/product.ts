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
            return Object.keys(this.findIndex).map(id => this.load(id))
        } else { 
            return undefined 
        } 
    }
    getProductFromCache(productId: string) { 
        return this.load(productId)
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
        product = this.store(product)
        this.addToFindIndex(product)
    }
    update(product: Product): void {
        product = this.store(product)
        this.removeFromFindIndex(product)
        this.addToFindIndex(product)
    }
    delete(product: Product): void {
        product = this.store(product)
        this.removeFromFindIndex(product)
    }

    // REST
    
    async findProducts(): Promise<Product[]> {
        if (!this.findIndex) {
            // Call backend
            let products = await ProductClient.findProducts()
            // Update product index
            products = products.map(product => this.store(product))
            // Init find index
            this.findIndex = {}
            // Update find index
            products.forEach(product => this.addToFindIndex(product))
        }
        // Return products
        return Object.keys(this.findIndex).map(id => this.load(id)).filter(product => !product.deleted)
    }

    async addProduct(data: ProductAddData): Promise<Product> {
        // Call backend
        let product = await ProductClient.addProduct(data)
        // Update product index
        product = this.store(product)
        // Update product set
        this.addToFindIndex(product)
        // Return product
        return this.load(product.id)
    }

    async getProduct(id: string): Promise<Product> {
        if (!this.has(id)) {
            // Call backend
            let product = await ProductClient.getProduct(id)
            // Update product index
            product = this.store(product)
            // Add to find index
            this.addToFindIndex(product)
        }
        // Return product
        return this.load(id)
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        // Call backend
        let product = await ProductClient.updateProduct(id, data)
        // Update product index
        product = this.store(product)
        // Update find result
        this.removeFromFindIndex(product)
        this.addToFindIndex(product)
        // Return product
        return this.load(id)
    }

    async deleteProduct(id: string): Promise<Product> {
        // Call backend
        let product = await ProductClient.deleteProduct(id)
        // Update product index
        product = this.store(product)
        // Update find result
        this.removeFromFindIndex(product)
        // Return product
        return this.load(id)
    }
}

export const ProductManager = new ProductManagerImpl()