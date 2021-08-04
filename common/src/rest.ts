import { Audit, Product, User } from './data'

export interface UserREST {
    findAll(): Promise<User[]>
    addUser(id: User): Promise<User>
    updateUser(user: User): Promise<User>
}

export interface ProductREST {
    findAll(): Promise<Product[]>
}

export interface AuditREST {
    findAll(): Promise<Audit[]>
}