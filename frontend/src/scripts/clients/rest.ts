import axios from 'axios'
// Commons
import { Comment, CommentData, CommentREST, Issue, IssueData, IssueREST, Product, ProductData, ProductREST, User, UserData, UserREST, Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'
// Globals
import { auth } from './auth'

class UserClient implements UserREST {
    async checkUser(): Promise<User> {
        return (await axios.get<User>('/rest/users/check', { auth })).data
    }
    async findUsers(): Promise<User[]> {
        return (await axios.get<User[]>(`/rest/users`, { auth } )).data
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
    async findProducts(): Promise<Product[]> {
        return (await axios.get<Product[]>(`/rest/products`, { auth })).data
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
    async findVersions(product: string): Promise<Version[]> {
        return (await axios.get<Version[]>('/rest/versions', { params: { product }, auth } )).data
    }
    async addVersion(data: VersionData, file: File): Promise<Version> {
        const body = new FormData()
        body.append('userId', data.userId)
        body.append('productId', data.productId)
        body.append('time', data.time)
        body.append('major', `${data.major}`)
        body.append('minor', `${data.minor}`)
        body.append('patch', `${data.patch}`)
        body.append('file', file)
        return (await axios.post<Version>('/rest/versions', body, { auth })).data
    }
    async getVersion(id: string): Promise<Version> {
        return (await axios.get<Version>(`/rest/versions/${id}`, { auth })).data
    }
    async updateVersion(id: string, data: VersionData, file?: File): Promise<Version> {
        const body = new FormData()
        body.append('userId', data.userId)
        body.append('productId', data.productId)
        body.append('time', data.time)
        body.append('major', `${data.major}`)
        body.append('minor', `${data.minor}`)
        body.append('patch', `${data.patch}`)
        body.append('file', file)
        return (await axios.put<Version>(`/rest/versions/${id}`, body, { auth })).data
    }
    async deleteVersion(id: string): Promise<Version> {
        return (await axios.delete<Version>(`/rest/versions/${id}`, { auth })).data
    }
}

class IssueClient implements IssueREST {
    async findIssues(product: string): Promise<Issue[]> {
        return (await axios.get<Issue[]>(`/rest/issues`, { params: { product }, auth })).data
    }
    async addIssue(data: IssueData): Promise<Issue> {
        return (await axios.post<Issue>('/rest/issues', data, { auth })).data
    }
    async getIssue(id: string): Promise<Issue> {
        return (await axios.get<Issue>(`/rest/issues/${id}`, { auth })).data
    }
    async updateIssue(id: string, data: IssueData): Promise<Issue> {
        return (await axios.put<Issue>(`/rest/issues/${id}`, data, { auth })).data
    }
    async deleteIssue(id: string): Promise<Issue> {
        return (await axios.delete<Issue>(`/rest/issues/${id}`, { auth })).data
    }
}

class CommentClient implements CommentREST {
    async findComments(issue: string): Promise<Comment[]> {
        return (await axios.get<Comment[]>('/rest/comments', { params: { issue }, auth })).data
    }
    async addComment(data: CommentData): Promise<Comment> {
        return (await axios.post<Comment>('/rest/comments', data, { auth })).data
    }
    async getComment(id: string): Promise<Comment> {
        return (await axios.get<Comment>(`/rest/comments/${id}`, { auth })).data
    }
    async updateComment(id: string, data: CommentData): Promise<Comment> {
        return (await axios.put<Comment>(`/rest/comments/${id}`, data, { auth })).data
    }
    async deleteComment(id: string): Promise<Comment> {
        return (await axios.delete<Comment>(`/rest/comments/${id}`, { auth })).data
    }
}

export const UserAPI = new UserClient()
export const ProductAPI = new ProductClient()
export const VersionAPI = new VersionClient()
export const IssueAPI = new IssueClient()
export const CommentAPI = new CommentClient()
