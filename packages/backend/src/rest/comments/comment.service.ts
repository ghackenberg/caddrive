import { Injectable, NotFoundException } from '@nestjs/common'
import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import * as shortid from 'shortid'

@Injectable()
export class CommentService implements CommentREST {
    private static readonly comments: Comment[] = [
        { id: 'demo-1', userId: 'demo-1', issueId: 'demo-2', time: new Date('2022-04-12').toISOString(), text: 'Ok, can you provide a profile specification?', action: 'close', deleted: false },
        { id: 'demo-2', userId: 'demo-1', issueId: 'demo-3', time: new Date('2022-04-13').toISOString(), text: 'Ok, can you provide a RAL code?', action: 'none', deleted: false },
        { id: 'demo-3', userId: 'demo-2', issueId: 'demo-3', time: new Date('2022-04-14').toISOString(), text: 'I will search for a RAL code', action: 'close', deleted: false },
        { id: 'demo-4', userId: 'demo-2', issueId: 'demo-1', time: new Date('2022-04-15').toISOString(), text: 'Done', action: 'close', deleted: false },

        { id: 'demo-5', userId: 'demo-2', issueId: 'demo-4', time: new Date('2022-04-17').toISOString(), text: 'Done', action: 'close', deleted: false },
        { id: 'demo-6', userId: 'demo-1', issueId: 'demo-5', time: new Date('2022-04-20').toISOString(), text: 'Done', action: 'close', deleted: false },
        { id: 'demo-7', userId: 'demo-4', issueId: 'demo-6', time: new Date('2022-04-21').toISOString(), text: 'Done', action: 'close', deleted: false },
        { id: 'demo-8', userId: 'demo-3', issueId: 'demo-7', time: new Date('2022-04-22').toISOString(), text: 'Work in progress', action: 'none', deleted: false },

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