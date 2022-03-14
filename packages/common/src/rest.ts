import { Issue, IssueAddData, IssueUpdateData, Comment, Product, ProductAddData,ProductUpdateData, User, Version, CommentAddData, CommentUpdateData,  Member, MemberAddData, MemberUpdateData } from './data'

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
    addProduct(data: ProductAddData): Promise<Product>
    getProduct(id: string): Promise<Product>
    updateProduct(id: string, data: ProductUpdateData): Promise<Product>
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
    addIssue(data: IssueAddData): Promise<Issue>
    getIssue(id: string): Promise<Issue>
    updateIssue(id: string, data: IssueUpdateData): Promise<Issue>
    deleteIssue(id: string): Promise<Issue>
}

export interface CommentREST {
    findComments(issueId: string): Promise<Comment[]>
    addComment(data: CommentAddData): Promise<Comment>
    getComment(id: string): Promise<Comment>
    updateComment(id: string, data: CommentUpdateData): Promise<Comment>
    deleteComment(id: string): Promise<Comment>
}

export interface MemberREST {
    findMembers(productId: string, userId?: string): Promise<Member[]>
    addMember(data: MemberAddData): Promise<Member>
    getMember(id: string): Promise<Member>
    updateMember(id: string, data: MemberUpdateData): Promise<Member>
    deleteMember(id: string): Promise<Member>
}

export interface FileREST<D> {
    getFile(id: string): Promise<D>
}