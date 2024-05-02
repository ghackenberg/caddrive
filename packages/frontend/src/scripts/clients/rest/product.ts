import axios from 'axios'

import { ProductCreate, ProductREST, ProductRead, ProductUpdate } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class ProductClientImpl implements ProductREST {
    async findProducts(_public?: 'true' | 'false'): Promise<ProductRead[]> {
        return (await axios.get<ProductRead[]>(`/rest/products`, { params: { public: _public }, ...auth })).data
    }
    async addProduct(data: ProductCreate): Promise<ProductRead> {
        const product = (await axios.post<ProductRead>('/rest/products', data, auth)).data
        CacheAPI.putProduct(product)
        return product
    }
    async getProduct(productId: string): Promise<ProductRead> {
        return (await axios.get<ProductRead>(`/rest/products/${productId}`, auth)).data
    }
    async updateProduct(productId: string, data: ProductUpdate): Promise<ProductRead> {
        const product = (await axios.put<ProductRead>(`/rest/products/${productId}`, data, auth)).data
        CacheAPI.putProduct(product)
        return product
    }
    async deleteProduct(productId: string): Promise<ProductRead> {
        const product = (await axios.delete<ProductRead>(`/rest/products/${productId}`, auth)).data
        CacheAPI.putProduct(product)
        return product
    }
}

export const ProductClient = new ProductClientImpl()