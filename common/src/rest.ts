import { Audit, AuditData, CommentEvent, CommentEventData, EventData, Product, ProductData, User, UserData, Version, VersionData } from './data'

export interface AuditREST {
    findAudits(quick?: string, name?: string, product?: string, version?: string): Promise<Audit[]>
    getAudit(id: string): Promise<Audit>
    addAudit(audit: AuditData): Promise<Audit>
    updateAudit(audit: Audit): Promise<Audit>
}

export interface EventREST {
    findEvents(quick?: string, audit?: string, type?: string, user?: string, product?: string, version?: string, comment?: string): Promise<(EventData  & { id: string })[]>
    enterEvent(enterEvent: EventData): Promise<EventData & { id: string }>
    leaveEvent(leaveEvent: EventData): Promise<EventData & { id: string }>
    submitEvent(submitEvent: CommentEventData): Promise<CommentEvent>
}

export interface ProductREST {
    findProducts(name?: string): Promise<Product[]>
    getProduct(id: string): Promise<Product>
    addProduct(product: ProductData): Promise<Product>
    updateProduct(product: Product): Promise<Product>
}

export interface UserREST {
    checkUser(): Promise<User>
    findUsers(quick?: string, name?: string, email?: string): Promise<User[]>
    getUser(id: string): Promise<User>
    addUser(user: UserData): Promise<User>
    updateUser(user: User): Promise<User>
}

export interface VersionREST {
    findVersions(quick?: string, name?: string, product?: string): Promise<Version[]>
    getVersion(id: string): Promise<Version>
    addVersion(version: VersionData): Promise<Version>
    deleteVersion(version: Version): Promise<Version>
}