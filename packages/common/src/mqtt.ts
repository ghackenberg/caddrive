import { Comment } from "./data/comment"
import { Issue } from "./data/issue"
import { Member } from "./data/member"
import { Milestone } from "./data/milestone"
import { Product } from "./data/product"
import { User } from "./data/user"
import { Version } from "./data/version"

export interface UserMessage {
    type: 'state' | 'patch'
    users?: User[]
}

export interface ProductMessage  {
    type: 'state' | 'patch'
    products?: Product[]
    members?: Member[]
    issues?: Issue[]
    comments?: Comment[]
    milestones?: Milestone[]
    versions?: Version[]
}