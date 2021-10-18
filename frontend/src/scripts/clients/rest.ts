import axios from 'axios'
// Commons
import { Audit, AuditData, AuditREST, CommentEvent, CommentEventData, EventData, EventREST, Product, ProductData, ProductREST, User, UserData, UserREST, Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'
// Globals
import { auth } from './auth'

class AuditClient implements AuditREST {  
    
    async addAudit(audit: AuditData): Promise<Audit> {
        return (await axios.post<Audit>('/rest/audits', audit, { auth })).data
    }

    async deleteAudit(audit: Audit): Promise<Audit[]> {
        return (await axios.put<Audit[]>('/rest/audits', audit, { auth })).data
    }

    async findAudits(quick?: string, name?: string, product?: string, version?: string): Promise<Audit[]> {
        return (await axios.get<Audit[]>(`/rest/audits`, { params: {quick, name, product, version}, auth })).data
    }

    async getAudit(id: string): Promise<Audit> {
        return (await axios.get<Audit>(`/rest/audits/${id}`, { auth })).data
    }

    async updateAudit(audit: Audit): Promise<Audit> {
        return (await axios.put<Audit>(`/rest/audits/${audit.id}`, audit, { auth })).data
    }
}

class EventClient implements EventREST {

    async deleteEvent(event: EventData & {id: string}): Promise<(EventData & { id: string })[]> {
        return (await axios.put<(EventData & { id: string })[]>('/rest/events', event, { auth })).data
    }

    async enterEvent(enterEvent: EventData): Promise<EventData & { id: string }> {
        return (await axios.post<EventData & { id: string }>('/rest/events/enters', enterEvent, { auth })).data
    }

    async findEvents(quick?: string, audit?: string, type?: string, user?: string, product?: string, version?: string, comment?: string): Promise<(EventData & { id: string })[]> {
        return (await axios.get<(EventData & { id: string })[]>('/rest/events', { params: {quick, audit, type, user, product, version, comment}, auth })).data
    }

    async leaveEvent(leaveEvent: EventData): Promise<EventData & { id: string }> {
        return (await axios.post<EventData & { id: string }>('/rest/events/leaves', leaveEvent, { auth })).data
    }

    async submitEvent(submitEvent: CommentEventData): Promise<CommentEvent> {
        return (await axios.post<CommentEvent>('/rest/events/comments', submitEvent, { auth })).data
    }
}

class ProductClient implements ProductREST {

    async addProduct(product: ProductData): Promise<Product> {
        return (await axios.post<Product>('/rest/products', product, { auth })).data
    }

    async deleteProduct(product: Product): Promise<Product[]> {
        return (await axios.put<Product[]>('rest/products', product, { auth })).data
    }

    async findProducts(name?: string): Promise<Product[]> {
        return (await axios.get<Product[]>(`/rest/products`, { params: {name}, auth })).data
    }

    async getProduct(id: string): Promise<Product> {
        return (await axios.get<Product>(`/rest/products/${id}`, { auth })).data
    }

    async updateProduct(product: Product): Promise<Product> {
        return (await axios.put<Product>(`/rest/products/${product.id}`, product, { auth })).data
    }
}

class UserClient implements UserREST {
    async addUser(user: UserData): Promise<User> {
        return (await axios.post<User>('/rest/users', user, { auth })).data
    }
    
    async checkUser(): Promise<User> {
        return (await axios.get<User>('/rest/users/check', { auth })).data
    }

    async deleteUser(user: User): Promise<User[]> {
        return (await axios.put<User[]>('rest/users', user, { auth })).data
    }

    async findUsers(quick?: string, name?: string, email?: string): Promise<User[]> {
        return (await axios.get<User[]>(`/rest/users`, { params: {quick, name, email}, auth } )).data
    }

    async getUser(id: string): Promise<User> {
        return (await axios.get<User>(`/rest/users/${id}`, { auth })).data
    }

    async updateUser(user: User): Promise<User> {
        return (await axios.put<User>(`/rest/users/${user.id}`, user, { auth })).data
    }
}

class VersionClient implements VersionREST {
    
    async addVersion(version: VersionData): Promise<Version> {
        return (await axios.post<Version>('/rest/versions', version, { auth })).data
    }

    async deleteVersion(version: Version): Promise<Version[]> {
        return (await axios.put<Version[]>('/rest/versions', version, { auth })).data
    }

    async findVersions(quick?: string, name?: string, product?: string): Promise<Version[]> {
        return (await axios.get<Version[]>('/rest/versions', { params: {quick, name, product}, auth } )).data
    }

    async getVersion(id: string): Promise<Version> {
        return (await axios.get<Version>(`/rest/versions/${id}`, { auth })).data
    }

    async updateVersion(version: Version): Promise<Version> {
        return (await axios.put<Version>(`/rest/versions/${version.id}`, version, { auth })).data
    }
}

export const AuditAPI = new AuditClient()
export const EventAPI = new EventClient()
export const ProductAPI = new ProductClient()
export const UserAPI = new UserClient()
export const VersionAPI = new VersionClient()
