import { Comment, Issue, Member, Milestone, Product, User, Version } from "productboard-common"

export const USER_CACHE: { [userId: string]: User } = {}
export const PRODUCT_CACHE: { [productId: string]: Product } = {}
export const MEMBER_CACHE: { [memberId: string]: Member } = {}
export const ISSUE_CACHE: { [issueId: string]: Issue } = {}
export const COMMENT_CACHE: { [commentId: string]: Comment } = {}
export const MILESTONE_CACHE: { [milestoneId: string]: Milestone } = {}
export const VERSION_CACHE: { [versionId: string]: Version } = {}

type IdIndex = { [id: string]: boolean }

export const MEMBERS_CACHE: { [productId: string]: IdIndex } = {}
export const ISSUES_CACHE: { [issueId: string]: IdIndex } = {}
export const COMMENTS_CACHE: { [commentId: string]: IdIndex } = {}
export const MILESTONES_CACHE: { [milestoneId: string]: IdIndex } = {}
export const VERSIONS_CACHE: { [versionId: string]: IdIndex } = {}