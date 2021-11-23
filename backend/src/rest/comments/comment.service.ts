import { Injectable, NotFoundException } from '@nestjs/common'
import { CommentREST, Comment, CommentData, } from 'fhooe-audit-platform-common'
import * as shortid from 'shortid'

@Injectable()
export class CommentService implements CommentREST {
    private static readonly comments: Comment[] = [
        { id: 'demo-1', userId: 'demo', issueId: 'demo-1', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' },
        { id: 'demo-2', userId: 'demo', issueId: 'demo-1', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' },
        { id: 'demo-3', userId: 'demo', issueId: 'demo-1', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' },
        { id: 'demo-4', userId: 'demo', issueId: 'demo-2', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' },
        { id: 'demo-5', userId: 'demo', issueId: 'demo-2', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' },
        { id: 'demo-6', userId: 'demo', issueId: 'demo-2', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' },
        { id: 'demo-7', userId: 'demo', issueId: 'demo-3', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' },
        { id: 'demo-8', userId: 'demo', issueId: 'demo-3', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' },
        { id: 'demo-9', userId: 'demo', issueId: 'demo-3', time: new Date().toISOString(), text: 'This comment demonstrates the capabilities of ProductBoard.' }
    ]
 
    async findComments(issueId: string): Promise<Comment[]> {
        const result: Comment[] = []
        
        for (const comment of CommentService.comments) {
            if (comment.issueId != issueId) {
                continue
            }
            result.push(comment)   
        }

        return result
    }

    async addComment(data: CommentData): Promise<Comment> {
        const comment = { id: shortid(), ...data }
        CommentService.comments.push(comment)
        return comment
    }

    async getComment(id: string): Promise<Comment> {
        for (const comment of CommentService.comments) {
            if (comment.id == id) {
                return comment
            }
        }
        throw new NotFoundException()
    }

    async updateComment(id: string, data: CommentData): Promise<Comment> {
        for (var index = 0; index < CommentService.comments.length; index++) {
            const comment = CommentService.comments[index]
            if (comment.id == id) {
                CommentService.comments.splice(index, 1, { id, ...data })
                return CommentService.comments[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteComment(id: string): Promise<Comment> {
        for (var index = 0; index < CommentService.comments.length; index++) {
            const comment = CommentService.comments[index]
            if (comment.id == id) {
                CommentService.comments.splice(index, 1)
                return comment
            }
        }
        throw new NotFoundException()
    }
}