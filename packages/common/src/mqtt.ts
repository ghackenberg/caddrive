import { Comment } from "./data/comment"
import { Issue } from "./data/issue"
import { Member } from "./data/member"
import { Milestone } from "./data/milestone"
import { Product } from "./data/product"
import { User } from "./data/user"
import { Version } from "./data/version"

type Index<T> = { [id: string]: T }

export interface UserMessage {
    type: 'state' | 'patch'
    data: {
        users?: Index<User>
    }
}

export interface ProductMessage  {
    type: 'state' | 'patch'
    data: {
        products?: Index<Product>,
        members?: Index<Member>
        issues?: Index<Issue>
        comments?: Index<Comment>
        milestones?: Index<Milestone>
        versions?: Index<Version>
    }
}