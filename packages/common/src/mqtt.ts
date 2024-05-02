import { AttachmentRead } from "./data/attachment"
import { CommentRead } from "./data/comment"
import { IssueRead } from "./data/issue"
import { MemberRead } from "./data/member"
import { MilestoneRead } from "./data/milestone"
import { ProductRead } from "./data/product"
import { UserRead } from "./data/user"
import { VersionRead } from "./data/version"

export interface UserMessage {
    type: 'state' | 'patch'
    users?: UserRead[]
}

export interface ProductMessage  {
    type: 'state' | 'patch'
    products?: ProductRead[]
    members?: MemberRead[]
    issues?: IssueRead[]
    comments?: CommentRead[]
    attachments?: AttachmentRead[]
    milestones?: MilestoneRead[]
    versions?: VersionRead[]
}