import { Product, ProductData, ProductREST } from 'productboard-common'
import { ProductAPI } from '../clients/rest/product'

class ProductManagerImpl implements ProductREST {
    async findProducts(): Promise<Product[]> {
        return ProductAPI.findProducts()
    }
    async addProduct(data: ProductData): Promise<Product> {
        return ProductAPI.addProduct(data)
    }
    async getProduct(id: string): Promise<Product> {
        return ProductAPI.getProduct(id)
    }
    async updateProduct(id: string, data: ProductData): Promise<Product> {
        return ProductAPI.updateProduct(id, data)
    }
    async deleteProduct(id: string): Promise<Product> {
        return ProductAPI.deleteProduct(id)
    }
}

export const ProductManager = new ProductManagerImpl()