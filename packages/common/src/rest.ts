import { JWK } from 'jose'

import { AttachmentRead } from './data/attachment'
import { CommentRead, CommentCreate, CommentUpdate } from './data/comment'
import { IssueRead, IssueCreate, IssueUpdate } from './data/issue'
import { MemberRead, MemberCreate, MemberUpdate } from './data/member'
import { MilestoneRead, MilestoneCreate, MilestoneUpdate } from './data/milestone'
import { ProductRead, ProductCreate, ProductUpdate } from './data/product'
import { TokenActivateRequest, TokenActivateResponse, TokenCreateRequest, TokenCreateResponse, TokenRefreshResponse } from './data/token'
import { UserRead } from './data/user'
import { VersionRead } from './data/version'

export interface KeyREST {
    getPublicJWK(): Promise<JWK>
}

export interface TokenREST {
    createToken(request: TokenCreateRequest): Promise<TokenCreateResponse>
    activateToken(tokenId: string, request: TokenActivateRequest): Promise<TokenActivateResponse>
    refreshToken(): Promise<TokenRefreshResponse>
}

export interface UserREST<D, F> {
    findUsers(query?: string, productId?: string): Promise<UserRead[]>
    getUser(userId: string): Promise<UserRead>
    updateUser(userId: string, data: D, file?: F): Promise<UserRead>
    deleteUser(userId: string): Promise<UserRead>
}

export interface ProductREST {
    findProducts(_public?: 'true' | 'false'): Promise<ProductRead[]>
    addProduct(data: ProductCreate): Promise<ProductRead>
    getProduct(productId: string): Promise<ProductRead>
    updateProduct(productId: string, data: ProductUpdate): Promise<ProductRead>
    deleteProduct(productId: string): Promise<ProductRead>
}

export interface VersionREST<DA, DU, M, D, I> {
    findVersions(productId: string): Promise<VersionRead[]>
    addVersion(productId: string, data: DA, files: { model: M, delta: D, image: I }): Promise<VersionRead>
    getVersion(productId: string, issueId: string): Promise<VersionRead>
    updateVersion(productId: string, issueId: string, data: DU, files?: {model: M, delta: D, image: I}): Promise<VersionRead>
    deleteVersion(productId: string, issueId: string): Promise<VersionRead>
}

export interface IssueREST {
    findIssues(productId: string): Promise<IssueRead[]>
    addIssue(productId: string, data: IssueCreate): Promise<IssueRead>
    getIssue(pruductId: string, issueId: string): Promise<IssueRead>
    updateIssue(productId: string, issueId: string, data: IssueUpdate): Promise<IssueRead>
    deleteIssue(productId: string, issueId: string): Promise<IssueRead>
}

export interface CommentREST {
    findComments(productId: string, issueId: string): Promise<CommentRead[]>
    addComment(productId: string, issueId: string, data: CommentCreate): Promise<CommentRead>
    getComment(productId: string, issueId: string, commentId: string): Promise<CommentRead>
    updateComment(productId: string, issueId: string, commentId: string, data: CommentUpdate): Promise<CommentRead>
    deleteComment(productId: string, issueId: string, commentId: string): Promise<CommentRead>
}

export interface AttachmentREST<AA, AU, F> {
    findAttachments(productId: string): Promise<AttachmentRead[]>
    addAttachment(productId: string, data: AA, file: F): Promise<AttachmentRead>
    getAttachment(productId: string, attachmentId: string): Promise<AttachmentRead>
    updateAttachment(productId: string, attachmentId: string, data: AU, file: F): Promise<AttachmentRead>
    deleteAttachment(productId: string, attachmentId: string): Promise<AttachmentRead>
}

export interface MilestoneREST {
    findMilestones(productId: string): Promise<MilestoneRead[]>
    addMilestone(productId: string, data: MilestoneCreate): Promise<MilestoneRead>
    getMilestone(productId: string, milestoneId: string): Promise<MilestoneRead>
    updateMilestone(productId: string, milestoneId: string, data: MilestoneUpdate): Promise<MilestoneRead>
    deleteMilestone(productId: string, milestoneId: string): Promise<MilestoneRead>
}

export interface MemberREST {
    findMembers(productId: string): Promise<MemberRead[]>
    addMember(productId: string, data: MemberCreate): Promise<MemberRead>
    getMember(productId: string, memberId: string): Promise<MemberRead>
    updateMember(productId: string, memberId: string, data: MemberUpdate): Promise<MemberRead>
    deleteMember(productId: string, memberId: string): Promise<MemberRead>
}

export interface FileREST<D> {
    getFile(fileId: string): Promise<D>
}