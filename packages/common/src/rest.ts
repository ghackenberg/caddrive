import { Issue, IssueData, Comment, Product, ProductData, User, Version, CommentData } from './data'

export interface UserREST<D, F> {
    checkUser(): Promise<User>
    findUsers(): Promise<User[]>
    addUser(data: D, file?: F): Promise<User>
    getUser(id: string): Promise<User>
    updateUser(id: string, data: D, file?: F): Promise<User>
    deleteUser(id: string): Promise<User>
}

export interface ProductREST {
    findProducts(): Promise<Product[]>
    addProduct(data: ProductData): Promise<Product>
    getProduct(id: string): Promise<Product>
    updateProduct(id: string, data: ProductData): Promise<Product>
    deleteProduct(id: string): Promise<Product>
}

export interface VersionREST<D, F> {
    findVersions(productId: string): Promise<Version[]>
    addVersion(data: D, file: F): Promise<Version>
    getVersion(id: string): Promise<Version>
    updateVersion(id: string, data: D, file?: F): Promise<Version>
    deleteVersion(id: string): Promise<Version>
}

export interface IssueREST {
    findIssues(productId: string): Promise<Issue[]>
    addIssue(data: IssueData): Promise<Issue>
    getIssue(id: string): Promise<Issue>
    updateIssue(id: string, data: IssueData): Promise<Issue>
    deleteIssue(id: string): Promise<Issue>
}

export interface CommentREST {
    findComments(issueId: string): Promise<Comment[]>
    addComment(data: CommentData): Promise<Comment>
    getComment(id: string): Promise<Comment>
    updateComment(id: string, data: CommentData): Promise<Comment>
    deleteComment(id: string): Promise<Comment>
}