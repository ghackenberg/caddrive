import axios from 'axios'
import { Audit, AuditData, AuditREST, CommentEventData, EventData, MemoREST, Product, ProductData, ProductREST, User, UserData, UserREST, Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'

class AuditClient implements AuditREST {
    async findAll() {
        return (await axios.get<Audit[]>('/rest/audits')).data
    }
    
    async findAudits(name: string) {
        return (await axios.get<Audit[]>(`/rest/audits/${name}`)).data
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

class MemoClient implements MemoREST {
    async findAll() {
        return (await axios.get<CommentEventData[]>('/rest/memos')).data
    }
    
    async enterMemo(enterEvent: EventData) {
        return (await axios.post<EventData>('/rest/memos', enterEvent)).data
    }

    async leaveMemo(leaveEvent: EventData) {
        return (await axios.post<EventData>('/rest/memos', leaveEvent)).data
    }

    async submitMemo(memo: CommentEventData) {
        return (await axios.post<CommentEventData>('/rest/memos', memo)).data
    }
}

class ProductClient implements ProductREST {
    async findAll() {
        return (await axios.get<Product[]>('/rest/products')).data
    }

    async findProducts(name: string) {
        return (await axios.get<Product[]>(`/rest/products/${name}`)).data
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

    async findUsers(name: string) {
        return (await axios.get<User[]>(`/rest/users/${name}`)).data
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

export const AuditAPI = new AuditClient()
export const MemoAPI = new MemoClient()
export const ProductAPI = new ProductClient()
export const UserAPI = new UserClient()
export const VersionAPI = new VersionClient()
