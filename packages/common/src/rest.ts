import { JWK } from 'jose'

import { Attachment } from './data/attachment'
import { Comment, CommentAddData, CommentUpdateData } from './data/comment'
import { Issue, IssueAddData, IssueUpdateData } from './data/issue'
import { Member, MemberAddData, MemberUpdateData } from './data/member'
import { Milestone, MilestoneAddData, MilestoneUpdateData } from './data/milestone'
import { Product, ProductAddData, ProductUpdateData } from './data/product'
import { ActivateTokenRequest, ActivateTokenResponse, CreateTokenRequest, CreateTokenResponse, RefreshTokenResponse } from './data/token'
import { User } from './data/user'
import { Version } from './data/version'

export interface KeyREST {
    getPublicJWK(): Promise<JWK>
}

export interface TokenREST {
    createToken(request: CreateTokenRequest): Promise<CreateTokenResponse>
    activateToken(tokenId: string, request: ActivateTokenRequest): Promise<ActivateTokenResponse>
    refreshToken(): Promise<RefreshTokenResponse>
}

export interface UserREST<D, F> {
    findUsers(query?: string, productId?: string): Promise<User[]>
    getUser(userId: string): Promise<User>
    updateUser(userId: string, data: D, file?: F): Promise<User>
    deleteUser(userId: string): Promise<User>
}

export interface ProductREST {
    findProducts(_public?: 'true' | 'false'): Promise<Product[]>
    addProduct(data: ProductAddData): Promise<Product>
    getProduct(productId: string): Promise<Product>
    updateProduct(productId: string, data: ProductUpdateData): Promise<Product>
    deleteProduct(productId: string): Promise<Product>
}

export interface VersionREST<DA, DU, M, I> {
    findVersions(productId: string): Promise<Version[]>
    addVersion(productId: string, data: DA, files: { model: M, image: I }): Promise<Version>
    getVersion(productId: string, issueId: string): Promise<Version>
    updateVersion(productId: string, issueId: string, data: DU, files?: {model: M, image: I}): Promise<Version>
    deleteVersion(productId: string, issueId: string): Promise<Version>
}

export interface IssueREST {
    findIssues(productId: string): Promise<Issue[]>
    addIssue(productId: string, data: IssueAddData): Promise<Issue>
    getIssue(pruductId: string, issueId: string): Promise<Issue>
    updateIssue(productId: string, issueId: string, data: IssueUpdateData): Promise<Issue>
    deleteIssue(productId: string, issueId: string): Promise<Issue>
}

export interface CommentREST {
    findComments(productId: string, issueId: string): Promise<Comment[]>
    addComment(productId: string, issueId: string, data: CommentAddData): Promise<Comment>
    getComment(productId: string, issueId: string, commentId: string): Promise<Comment>
    updateComment(productId: string, issueId: string, commentId: string, data: CommentUpdateData): Promise<Comment>
    deleteComment(productId: string, issueId: string, commentId: string): Promise<Comment>
}

export interface AttachmentREST<AA, AU, F> {
    findAttachments(productId: string, issueId: string, commentId: string): Promise<Attachment[]>
    addAttachment(productId: string, issueId: string, commentId: string, data: AA, file: F): Promise<Attachment>
    getAttachment(productId: string, issueId: string, commentId: string, attachmentId: string): Promise<Attachment>
    updateAttachment(productId: string, issueId: string, commentId: string, attachmentId: string, data: AU, file?: F): Promise<Attachment>
    deleteAttachment(productId: string, issueId: string, commentId: string, attachmentId: string): Promise<Attachment>
}

export interface MilestoneREST {
    findMilestones(productId: string): Promise<Milestone[]>
    addMilestone(productId: string, data: MilestoneAddData): Promise<Milestone>
    getMilestone(productId: string, milestoneId: string): Promise<Milestone>
    updateMilestone(productId: string, milestoneId: string, data: MilestoneUpdateData): Promise<Milestone>
    deleteMilestone(productId: string, milestoneId: string): Promise<Milestone>
}

export interface MemberREST {
    findMembers(productId: string): Promise<Member[]>
    addMember(productId: string, data: MemberAddData): Promise<Member>
    getMember(productId: string, memberId: string): Promise<Member>
    updateMember(productId: string, memberId: string, data: MemberUpdateData): Promise<Member>
    deleteMember(productId: string, memberId: string): Promise<Member>
}

export interface FileREST<D> {
    getFile(fileId: string): Promise<D>
}