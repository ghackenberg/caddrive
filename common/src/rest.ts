import { Audit, AuditData, CommentEvent, CommentEventData, EventData, Product, ProductData, User, UserData, Version, VersionData } from './data'

export interface AuditREST {
    addAudit(audit: AuditData): Promise<Audit>
    deleteAudit(audit: Audit): Promise<Audit[]>
    findAudits(quick?: string, name?: string, product?: string, version?: string): Promise<Audit[]>
    getAudit(id: string): Promise<Audit>
    updateAudit(audit: Audit): Promise<Audit>
}

export interface EventREST {
    deleteEvent(event: EventData & { id: string }): Promise<(EventData & {id: string})[]>
    findEvents(quick?: string, audit?: string, type?: string, user?: string, product?: string, version?: string, comment?: string): Promise<(EventData  & { id: string })[]>
    enterEvent(enterEvent: EventData): Promise<EventData & { id: string }>
    leaveEvent(leaveEvent: EventData): Promise<EventData & { id: string }>
    submitEvent(submitEvent: CommentEventData): Promise<CommentEvent>
}

export interface ProductREST {
    addProduct(product: ProductData): Promise<Product>
    deleteProduct(product: Product): Promise<Product[]>
    findProducts(name?: string): Promise<Product[]>
    getProduct(id: string): Promise<Product>
    updateProduct(product: Product): Promise<Product>
}

export interface UserREST {
    addUser(user: UserData): Promise<User>
    checkUser(): Promise<User>
    deleteUser(user: User): Promise<User[]>
    findUsers(quick?: string, name?: string, email?: string): Promise<User[]>
    getUser(id: string): Promise<User>
    updateUser(user: User): Promise<User>
}

export interface VersionREST {
    addVersion(version: VersionData): Promise<Version>
    deleteVersion(version: Version): Promise<Version[]>
    findVersions(quick?: string, name?: string, product?: string): Promise<Version[]>
    getVersion(id: string): Promise<Version>
    updateVersion(version: Version): Promise<Version>
}