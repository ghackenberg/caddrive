import axios from 'axios'
import { Audit, AuditData, AuditREST, CommentEventData, EventData, EventREST, Product, ProductData, ProductREST, User, UserData, UserREST, Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'

class AuditClient implements AuditREST {  
    async findAudits(quick?: string, name?: string, product?: string, version?: string): Promise<Audit[]> {
        return (await axios.get<Audit[]>(`/rest/audits`, {params: {quick, name, product, version}})).data
    }

    async getAudit(id: string): Promise<Audit> {
        return (await axios.get<Audit>(`/rest/audits/${id}`)).data
    }

    async addAudit(audit: AuditData): Promise<Audit> {
        return (await axios.post<Audit>('/rest/audits', audit)).data
    }

    async updateAudit(audit: Audit): Promise<Audit> {
        return (await axios.put<Audit>('/rest/audits', audit)).data
    }
}

class EventClient implements EventREST {
    async findEvents(quick?: string, audit?: string, type?: string, user?: string, product?: string, version?: string, comment?: string): Promise<CommentEventData[]> {
        return (await axios.get<CommentEventData[]>('/rest/events', {params: {quick, audit, type, user, product, version, comment}})).data
    }
    
    async enterEvent(enterEvent: EventData): Promise<EventData> {
        return (await axios.post<EventData>('/rest/events/enters', enterEvent)).data
    }

    async leaveEvent(leaveEvent: EventData): Promise<EventData> {
        return (await axios.post<EventData>('/rest/events/leaves', leaveEvent)).data
    }

    async submitEvent(submitEvent: CommentEventData): Promise<CommentEventData> {
        return (await axios.post<CommentEventData>('/rest/events/comments', submitEvent)).data
    }
}

class ProductClient implements ProductREST {
    async findProducts(name?: string): Promise<Product[]> {
        return (await axios.get<Product[]>(`/rest/products`, {params: {name}})).data
    }

    async getProduct(id: string): Promise<Product> {
        return (await axios.get<Product>(`/rest/products/${id}`)).data
    }

    async addProduct(product: ProductData): Promise<Product> {
        return (await axios.post<Product>('/rest/products', product)).data
    }

    async updateProduct(product: Product): Promise<Product> {
        return (await axios.put<Product>('/rest/products', product)).data
    }
}

class UserClient implements UserREST {
    async findUsers(quick?: string, name?: string, email?: string): Promise<User[]> {
        return (await axios.get<User[]>(`/rest/users`, {params: {quick, name, email}} )).data
    }

    async getUser(id: string): Promise<User> {
        return (await axios.get<User>(`/rest/users/${id}`)).data
    }

    async addUser(user: UserData): Promise<User> {
        return (await axios.post<User>('/rest/users', user)).data
    }

    async updateUser(user: User): Promise<User> {
        return (await axios.put<User>('/rest/users', user)).data
    }
}

class VersionClient implements VersionREST {
    async findVersions(quick?: string, name?: string, product?: string): Promise<Version[]> {
        return (await axios.get<Version[]>('/rest/versions', {params: {quick, name, product}} )).data
    }

    async getVersion(id: string): Promise<Version> {
        return (await axios.get<Version>(`/rest/versions/${id}`)).data
    }

    async addVersion(version: VersionData): Promise<Version> {
        return (await axios.post<Version>('/rest/versions', version)).data
    }

    async deleteVersion(version: Version): Promise<Version> {
        return (await axios.put<Version>('/rest/versions', version)).data
    }
}

export const AuditAPI = new AuditClient()
export const EventAPI = new EventClient()
export const ProductAPI = new ProductClient()
export const UserAPI = new UserClient()
export const VersionAPI = new VersionClient()
