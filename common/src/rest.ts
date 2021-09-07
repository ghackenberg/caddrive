import { Audit, AuditData, CommentEventData, EventData, Product, ProductData, User, UserData, Version, VersionData } from './data'

export interface AuditREST {
    findAll(): Promise<Audit[]>
    findAudits(name: string): Promise<Audit[]>
    getAudit(id: string): Promise<Audit>
    addAudit(audit: AuditData): Promise<Audit>
    updateAudit(audit: Audit): Promise<Audit>
}

export interface MemoREST {
    findAll(): Promise<CommentEventData[]>
    enterMemo(enterEvent: EventData): Promise<EventData>
    leaveMemo(leaveEvent: EventData): Promise<EventData>
    submitMemo(memo: CommentEventData): Promise<CommentEventData>
}

export interface ProductREST {
    findAll(): Promise<Product[]>
    findProducts(name: string): Promise<Product[]>
    getProduct(id: string): Promise<Product>
    addProduct(product: ProductData): Promise<Product>
    updateProduct(product: Product): Promise<Product>
}

export interface UserREST {
    findAll(): Promise<User[]>
    findUsers(name: string): Promise<User[]>
    getUser(id: string): Promise<User>
    addUser(user: UserData): Promise<User>
    updateUser(user: User): Promise<User>
}

export interface VersionREST {
    findAll(product: string): Promise<Version[]>
    getVersion(id: string): Promise<Version>
    addVersion(version: VersionData): Promise<Version>
}