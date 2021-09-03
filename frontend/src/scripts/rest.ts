import axios from 'axios'
import { Audit, AuditData, AuditREST, Product, ProductData, ProductREST, User, UserData, UserREST, Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'

class AuditClient implements AuditREST {
    async findAll() {
        return (await axios.get<Audit[]>('/rest/audits')).data
    }

    async getAudit(id: string) {
        return (await axios.get<Audit>(`/rest/audits/${id}`)).data
    }

    async addAudit(audit: AuditData) {
        return (await axios.post<Audit>('/rest/audits', audit)).data
    }

    async updateAudit(audit: Audit) {
        return (await axios.put<Audit>('/rest/audits', audit)).data
    }
}

class ProductClient implements ProductREST {
    async findAll() {
        return (await axios.get<Product[]>('/rest/products')).data
    }

    async getProduct(id: string) {
        return (await axios.get<Product>(`/rest/products/${id}`)).data
    }

    async addProduct(product: ProductData) {
        return (await axios.post<Product>('/rest/products', product)).data
    }

    async updateProduct(product: Product) {
        return (await axios.put<Product>('/rest/products', product)).data
    }
}

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

class VersionClient implements VersionREST {
    async findAll(product: string) {
        return (await axios.get<Version[]>('/rest/versions', {params: {product}} )).data
    }

    async getVersion(id: string) {
        return (await axios.get<Version>(`/rest/versions/${id}`)).data
    }

    async addVersion(version: VersionData) {
        return (await axios.post<Version>('/rest/versions', version)).data
    }
}

export const ProductAPI = new ProductClient()
export const AuditAPI = new AuditClient()
export const UserAPI = new UserClient()
export const VersionAPI = new VersionClient()
