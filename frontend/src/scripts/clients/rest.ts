import axios from 'axios'
// Commons
import { Audit, AuditData, AuditREST, CommentEvent, CommentEventData, EnterEvent, EnterEventData, Event, EventREST, LeaveEvent, LeaveEventData, Product, ProductData, ProductREST, User, UserData, UserREST, Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'
// Globals
import { auth } from './auth'

class UserClient implements UserREST {
    async checkUser(): Promise<User> {
        return (await axios.get<User>('/rest/users/check', { auth })).data
    }
    async findUsers(quick?: string, name?: string, email?: string): Promise<User[]> {
        return (await axios.get<User[]>(`/rest/users`, { params: { quick, name, email }, auth } )).data
    }
    async addUser(data: UserData): Promise<User> {
        return (await axios.post<User>('/rest/users', data, { auth })).data
    }
    async getUser(id: string): Promise<User> {
        return (await axios.get<User>(`/rest/users/${id}`, { auth })).data
    }
    async updateUser(id: string, data: UserData): Promise<User> {
        return (await axios.put<User>(`/rest/users/${id}`, data, { auth })).data
    }
    async deleteUser(id: string): Promise<User> {
        return (await axios.delete<User>(`rest/users/${id}`, { auth })).data
    }
}

class ProductClient implements ProductREST {
    async findProducts(quick?: string, name?: string): Promise<Product[]> {
        return (await axios.get<Product[]>(`/rest/products`, { params: { quick, name }, auth })).data
    }
    async addProduct(data: ProductData): Promise<Product> {
        return (await axios.post<Product>('/rest/products', data, { auth })).data
    }
    async getProduct(id: string): Promise<Product> {
        return (await axios.get<Product>(`/rest/products/${id}`, { auth })).data
    }
    async updateProduct(id: string, data: ProductData): Promise<Product> {
        return (await axios.put<Product>(`/rest/products/${id}`, data, { auth })).data
    }
    async deleteProduct(id: string): Promise<Product> {
        return (await axios.delete<Product>(`/rest/products/${id}`, { auth })).data
    }
}

class VersionClient implements VersionREST<File> {
    async findVersions(quick?: string, name?: string, product?: string): Promise<Version[]> {
        return (await axios.get<Version[]>('/rest/versions', { params: { quick, name, product }, auth } )).data
    }
    async addVersion(data: VersionData, file: File): Promise<Version> {
        const body = new FormData()
        body.append('productId', data.productId)
        body.append('name', data.name)
        body.append('date', data.date)
        body.append('file', file)
        return (await axios.post<Version>('/rest/versions', body, { auth })).data
    }
    async getVersion(id: string): Promise<Version> {
        return (await axios.get<Version>(`/rest/versions/${id}`, { auth })).data
    }
    async updateVersion(id: string, data: VersionData, file?: File): Promise<Version> {
        const body = new FormData()
        body.append('id', id)
        body.append('productId', data.productId)
        body.append('name', data.name)
        body.append('date', data.date)
        body.append('file', file)
        return (await axios.put<Version>(`/rest/versions/${id}`, body, { auth })).data
    }
    async deleteVersion(id: string): Promise<Version> {
        return (await axios.delete<Version>(`/rest/versions/${id}`, { auth })).data
    }
}

class AuditClient implements AuditREST {
    async findAudits(quick?: string, name?: string, product?: string, version?: string): Promise<Audit[]> {
        return (await axios.get<Audit[]>(`/rest/audits`, { params: { quick, name, product, version }, auth })).data
    }
    async addAudit(data: AuditData): Promise<Audit> {
        return (await axios.post<Audit>('/rest/audits', data, { auth })).data
    }
    async getAudit(id: string): Promise<Audit> {
        return (await axios.get<Audit>(`/rest/audits/${id}`, { auth })).data
    }
    async updateAudit(id: string, data: AuditData): Promise<Audit> {
        return (await axios.put<Audit>(`/rest/audits/${id}`, data, { auth })).data
    }
    async deleteAudit(id: string): Promise<Audit> {
        return (await axios.delete<Audit>(`/rest/audits/${id}`, { auth })).data
    }
}

class EventClient implements EventREST {
    async findEvents(quick?: string, type?: string, comment?: string, user?: string, product?: string, version?: string, audit?: string): Promise<Event[]> {
        return (await axios.get<Event[]>('/rest/events', { params: { quick, type, comment, user, product, version, audit }, auth })).data
    }
    async addEnterEvent(data: EnterEventData): Promise<EnterEvent> {
        return (await axios.post<EnterEvent>('/rest/events/enters', data, { auth })).data
    }
    async addLeaveEvent(data: LeaveEventData): Promise<LeaveEvent> {
        return (await axios.post<LeaveEvent>('/rest/events/leaves', data, { auth })).data
    }
    async addCommentEvent(data: CommentEventData): Promise<CommentEvent> {
        return (await axios.post<CommentEvent>('/rest/events/comments', data, { auth })).data
    }
    async getEvent(id: string): Promise<Event> {
        return (await axios.get<Event>(`/rest/events/${id}`, { auth })).data
    }
    async deleteEvent(id: string): Promise<Event> {
        return (await axios.delete<Event>(`/rest/events/${id}`, { auth })).data
    }
}

export const UserAPI = new UserClient()
export const ProductAPI = new ProductClient()
export const VersionAPI = new VersionClient()
export const AuditAPI = new AuditClient()
export const EventAPI = new EventClient()
