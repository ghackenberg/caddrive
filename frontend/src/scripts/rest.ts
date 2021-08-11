import axios from 'axios'
import { Audit, AuditREST, Product, ProductREST, User, UserData, UserREST } from 'fhooe-audit-platform-common'

class UserClient implements UserREST {
    async findAll() {
        return (await axios.get<User[]>('/rest/users')).data
    }

    async getUser(id: string) {
        return (await axios.get<User>(`/rest/users/${id}`)).data
    }

    async addUser(user: UserData) {
        return (await axios.post<User>('/rest/users', user)).data
    }

    async updateUser(user: User) {
        return (await axios.put<User>('/rest/users', user)).data
    }
}

class ProductClient implements ProductREST {
    async findAll() {
        return (await axios.get<Product[]>('/rest/products')).data
    }

    async addProduct(product: Product) {
        return (await axios.post<Product>('/rest/products', product)).data
    }

    async updateProduct(product: Product) {
        return (await axios.put<Product>('/rest/products', product)).data
    }
}

class AuditClient implements AuditREST {
    async findAll() {
        return (await axios.get<Audit[]>('/rest/audits')).data
    }

    async addAudit(audit: Audit) {
        return (await axios.post<Audit>('/rest/audits', audit)).data
    }

    async updateAudit(audit: Audit) {
        return (await axios.put<Audit>('/rest/audits', audit)).data
    }
}

export const UserAPI = new UserClient()
export const ProductAPI = new ProductClient()
export const AuditAPI = new AuditClient()