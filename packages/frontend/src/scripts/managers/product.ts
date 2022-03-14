import { Product, ProductAddData, ProductUpdateData, ProductREST } from 'productboard-common'
import { ProductClient } from '../clients/rest/product'

class ProductManagerImpl implements ProductREST {
    private productIndex: {[id: string]: Product} = {}
    private productSet: {[id: string]: boolean}

    async findProducts(): Promise<Product[]> {
        if (!this.productSet) {
            // Call backend
            const products = await ProductClient.findProducts()
            // Update product index
            for (const product of products) {
                this.productIndex[product.id] = product
            }
            // Update product set
            this.productSet = {}
            for (const product of products) {
                this.productSet[product.id] = true
            }
        }
        // Return products
        return Object.keys(this.productSet).map(id => this.productIndex[id])
    }

    async addProduct(data: ProductAddData): Promise<Product> {
        // Call backend
        const product = await ProductClient.addProduct(data)
        // Update product index
        this.productIndex[product.id] = product
        // Update product set
        if (this.productSet) {
            this.productSet[product.id] = true
        }
        // Return product
        return product
    }

    async getProduct(id: string): Promise<Product> {
        if (!(id in this.productIndex)) {
            // Call backend
            const product = await ProductClient.getProduct(id)
            // Update product index
            this.productIndex[id] = product
            // Update product set
            if (this.productSet) {
                this.productSet[id] = true
            }
        }
        // Return product
        return this.productIndex[id]
    }

    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        // Call backend
        const product = await ProductClient.updateProduct(id, data)
        // Update product index
        this.productIndex[id] = product
        // Update product set
        if (this.productSet) {
            this.productSet[id] = true
        }
        // Return product
        return product
    }

    async deleteProduct(id: string): Promise<Product> {
        // Call backend
        const product = await ProductClient.deleteProduct(id)
        // Update product index
        this.productIndex[id] = product
        // Update product set
        if (this.productSet) {
            delete this.productSet[id]
        }
        // Return product
        return product
    }
}

export const ProductManager = new ProductManagerImpl()