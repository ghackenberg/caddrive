import { Injectable, NotFoundException } from '@nestjs/common'
import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import * as shortid from 'shortid'

@Injectable()
export class CommentService implements CommentREST {
    private static readonly comments: Comment[] = [
        { id: 'demo-1', userId: 'demo-1', issueId: 'demo-2', time: new Date().toISOString(), text: 'Ok, can you provide a profile specification?', action: 'none', deleted: false },
        { id: 'demo-2', userId: 'demo-1', issueId: 'demo-3', time: new Date().toISOString(), text: 'Ok, can you provide a RAL code?', action: 'none', deleted: false },
        { id: 'demo-3', userId: 'demo-2', issueId: 'demo-3', time: new Date().toISOString(), text: 'I will search for a RAL code', action: 'none', deleted: false },
    ]
 
    async findComments(issueId: string): Promise<Comment[]> {
        const result: Comment[] = []
        for (const comment of CommentService.comments) {
            if (comment.deleted) {
                continue
            }
            if (comment.issueId != issueId) {
                continue
            }
            result.push(comment)
        }
        return result
    }

    async addComment(data: CommentAddData): Promise<Comment> {
        // TODO check if user exists
        // TODO check if issue exists
        const comment = { id: shortid(), deleted: false, ...data }
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

    async updateComment(id: string, data: CommentUpdateData): Promise<Comment> {
        for (var index = 0; index < CommentService.comments.length; index++) {
            const comment = CommentService.comments[index]
            if (comment.id == id) {
                CommentService.comments.splice(index, 1, { ...comment,...data})
                return CommentService.comments[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteComment(id: string): Promise<Comment> {
        for (const comment of CommentService.comments) {
            if (comment.id == id) {
                comment.deleted = true
                return comment
            }
        }
        throw new NotFoundException()
    }
}