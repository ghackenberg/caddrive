import { Audit, Product, User, UserData } from './data'

export interface UserREST {
    findAll(): Promise<User[]>
    getUser(id: string): Promise<User>
    addUser(user: UserData): Promise<User>
    updateUser(user: User): Promise<User>
}

export interface ProductREST {
    findAll(): Promise<Product[]>
    addProduct(product: Product): Promise<Product>
    updateProduct(product: Product): Promise<Product>
}

export interface AuditREST {
    findAll(): Promise<Audit[]>
    addAudit(audit: Audit): Promise<Audit>
    updateAudit(audit: Audit): Promise<Audit>
}