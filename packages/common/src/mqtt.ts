import { AttachmentRead } from "./data/attachment.js"
import { CommentRead } from "./data/comment.js"
import { IssueRead } from "./data/issue.js"
import { MemberRead } from "./data/member.js"
import { MilestoneRead } from "./data/milestone.js"
import { ProductRead } from "./data/product.js"
import { UserRead } from "./data/user.js"
import { VersionRead } from "./data/version.js"

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

const userTopicRegex = /^\/users\/(?<userId>.*)$/
const productTopicRegex = /^\/products\/(?<productId>.*)$/

export function matchUserTopic(topic: string)
{
    const match = userTopicRegex.exec(topic)

    return match ? match.groups['userId'] : null
}

export function matchProductTopic(topic: string)
{
    const match = productTopicRegex.exec(topic)

    return match ? match.groups['productId'] : null
}