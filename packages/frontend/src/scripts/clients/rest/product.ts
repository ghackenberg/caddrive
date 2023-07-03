import axios from 'axios'

import { Product, ProductAddData, ProductUpdateData, ProductREST } from 'productboard-common'

import { auth } from '../auth'
import { MqttAPI } from '../mqtt'

class ProductClientImpl implements ProductREST {
    async findProducts(_public?: 'true' | 'false'): Promise<Product[]> {
        return (await axios.get<Product[]>(`/rest/products`, { params: { public: _public }, ...auth })).data
    }
    async addProduct(data: ProductAddData): Promise<Product> {
        const product = (await axios.post<Product>('/rest/products', data, auth)).data
        MqttAPI.publishProductLocal(product)
        return product
    }
    async getProduct(productId: string): Promise<Product> {
        return (await axios.get<Product>(`/rest/products/${productId}`, auth)).data
    }
    async updateProduct(productId: string, data: ProductUpdateData): Promise<Product> {
        const product = (await axios.put<Product>(`/rest/products/${productId}`, data, auth)).data
        MqttAPI.publishProductLocal(product)
        return product
    }
    async deleteProduct(productId: string): Promise<Product> {
        const product = (await axios.delete<Product>(`/rest/products/${productId}`, auth)).data
        MqttAPI.publishProductLocal(product)
        return product
    }
}

export const ProductClient = new ProductClientImpl()