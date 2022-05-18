import { Injectable, NotFoundException } from '@nestjs/common'
import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import { CommentRepository } from 'productboard-database'
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

    public constructor() {
        CommentRepository.count().then(async count => {
            if (count == 0) {
                for (const _comment of CommentService.comments) {
                     //await this.commentRepository.save(comment)
                }
            }
        })
    }
 
    async findComments(issueId: string): Promise<Comment[]> {
        const result: Comment[] = []

        const where = {deleted:false, issueId}
        for (const comment of await CommentRepository.find({ where })) {
            result.push(comment)
        }
        return result
    }

    async addComment(data: CommentAddData): Promise<Comment> {
        const comment = await CommentRepository.save({ id: shortid(), deleted: false, ...data })
        return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
    }

    async getComment(id: string): Promise<Comment> {
        const comment = await CommentRepository.findOne({ where: { id } })
        if (comment) {
            return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
        }
        throw new NotFoundException()
    }

    async updateComment(id: string, data: CommentUpdateData): Promise<Comment> {
        const comment = await CommentRepository.findOne({ where: { id } })
        if (comment) {
            comment.action = data.action
            comment.text = data.text
            await CommentRepository.save(comment)
            return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
        }
        throw new NotFoundException()
    }

    async deleteComment(id: string): Promise<Comment> {
        const comment = await CommentRepository.findOne({ where: { id } })
        if (comment) {
            comment.deleted = true
            await CommentRepository.save(comment)
            return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
        }
        throw new NotFoundException()
    }
}