import { Audit, AuditData, CommentEvent, CommentEventData, EnterEvent, EnterEventData, Event, LeaveEvent, LeaveEventData, Product, ProductData, User, UserData, Version, VersionData } from './data'

export interface UserREST {
    checkUser(): Promise<User>
    findUsers(quick?: string, name?: string, email?: string): Promise<User[]>
    addUser(user: UserData): Promise<User>
    getUser(id: string): Promise<User>
    updateUser(id: string, data: UserData): Promise<User>
    deleteUser(id: string): Promise<User>
}

export interface ProductREST {
    findProducts(quick?: string, name?: string): Promise<Product[]>
    addProduct(product: ProductData): Promise<Product>
    getProduct(id: string): Promise<Product>
    updateProduct(id: string, data: ProductData): Promise<Product>
    deleteProduct(id: string): Promise<Product>
}

export interface VersionREST<T> {
    findVersions(quick?: string, name?: string, productId?: string): Promise<Version[]>
    addVersion(version: VersionData, file: T): Promise<Version>
    getVersion(id: string): Promise<Version>
    updateVersion(id: string, data: VersionData, file?: T): Promise<Version>
    deleteVersion(id: string): Promise<Version>
}

export interface AuditREST {
    findAudits(quick?: string, name?: string, productId?: string, versionId?: string): Promise<Audit[]>
    addAudit(audit: AuditData): Promise<Audit>
    getAudit(id: string): Promise<Audit>
    updateAudit(id: string, data: AuditData): Promise<Audit>
    deleteAudit(id: string): Promise<Audit>
}

export interface EventREST {
    findEvents(quick?: string, type?: string, comment?: string, userId?: string, productId?: string, versionId?: string, auditId?: string): Promise<Event[]>
    addEnterEvent(enterEvent: EnterEventData): Promise<EnterEvent>
    addLeaveEvent(leaveEvent: LeaveEventData): Promise<LeaveEvent>
    addCommentEvent(submitEvent: CommentEventData): Promise<CommentEvent>
    deleteEvent(id: string): Promise<Event>
}