import { Comment, Issue, Member, Milestone, Product, User, Version } from "productboard-common"

export const USER_CACHE: { [userId: string]: User } = {}
export const PRODUCT_CACHE: { [productId: string]: Product } = {}
export const MEMBER_CACHE: { [memberId: string]: Member } = {}
export const ISSUE_CACHE: { [issueId: string]: Issue } = {}
export const COMMENT_CACHE: { [commentId: string]: Comment } = {}
export const MILESTONE_CACHE: { [milestoneId: string]: Milestone } = {}
export const VERSION_CACHE: { [versionId: string]: Version } = {}