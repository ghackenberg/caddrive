import { Product, ProductData, ProductREST } from 'productboard-common'
import { ProductClient } from '../clients/rest/product'

class ProductManagerImpl implements ProductREST {
    async findProducts(): Promise<Product[]> {
        return ProductClient.findProducts()
    }
    async addProduct(data: ProductData): Promise<Product> {
        return ProductClient.addProduct(data)
    }
    async getProduct(id: string): Promise<Product> {
        return ProductClient.getProduct(id)
    }
    async updateProduct(id: string, data: ProductData): Promise<Product> {
        return ProductClient.updateProduct(id, data)
    }
    async deleteProduct(id: string): Promise<Product> {
        return ProductClient.deleteProduct(id)
    }
}

export const ProductManager = new ProductManagerImpl()