import { Audit, AuditData, Product, ProductData, User, UserData, Version, VersionData } from './data'

export interface ProductREST {
    findAll(): Promise<Product[]>
    getProduct(id: string): Promise<Product>
    addProduct(product: ProductData): Promise<Product>
    updateProduct(product: Product): Promise<Product>
}

export interface AuditREST {
    findAll(): Promise<Audit[]>
    getAudit(id: string): Promise<Audit>
    addAudit(audit: AuditData): Promise<Audit>
    updateAudit(audit: Audit): Promise<Audit>
}

export interface UserREST {
    findAll(): Promise<User[]>
    getUser(id: string): Promise<User>
    addUser(user: UserData): Promise<User>
    updateUser(user: User): Promise<User>
}

export interface VersionREST {
    findAll(product: string): Promise<Version[]>
    getVersion(id: string): Promise<Version>
    addVersion(version: VersionData): Promise<Version>
}