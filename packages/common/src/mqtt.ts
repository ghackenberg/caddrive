import { Comment, Issue, Milestone, Product, User, Version } from "./main"

export interface TestUpMQTT {
    a(data: string): Promise<void>
    b(data: string): Promise<void>
}

export interface TestDownMQTT {
    c(data: string): void
    d(data: string): void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserUpMQTT {
    // empty
}

export interface UserDownMQTT {
    create(user: User): void
    update(user: User): void
    delete(user: User): void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProductUpMQTT {
    // empty
}

export interface ProductDownMQTT {
    create(product: Product): void
    update(product: Product): void
    delete(product: Product): void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VersionUpMQTT {
    // empty
}

export interface VersionDownMQTT {
    create(version: Version): void
    update(version: Version): void
    delete(version: Version): void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IssueUpMQTT {
    // empty
}

export interface IssueDownMQTT {
    create(issue: Issue): void
    update(issue: Issue): void
    delete(issue: Issue): void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommentUpMQTT {
    // empty
}

export interface CommentDownMQTT {
    create(comment: Comment): void
    update(comment: Comment): void
    delete(comment: Comment): void
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MilestoneUpMQTT {
    // empty
}

export interface MilestoneDownMQTT {
    create(milestone: Milestone): void
    update(milestone: Milestone): void
    delete(milestone: Milestone): void
}

// TODO Add missing MQTT interfaces