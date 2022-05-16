import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import * as shortid from 'shortid'
import { Repository } from 'typeorm'
import { CommentEntity } from './comment.entity'

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

    public constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository <CommentEntity>,
    ) {
        this.commentRepository.count().then(async count => {
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
        for (const comment of await this.commentRepository.find({ where })) {
            result.push(comment)
        }
        return result
    }

    async addComment(data: CommentAddData): Promise<Comment> {
        // TODO check if user exists
        // TODO check if issue exists
        const comment = await this.commentRepository.save({ id: shortid(), deleted: false, ...data })
        return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
    }

    async getComment(id: string): Promise<Comment> {
        const comment = await this.commentRepository.findOne(id)
        if (comment) {
            return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
        }
        throw new NotFoundException()
    }

    async updateComment(id: string, data: CommentUpdateData): Promise<Comment> {
        const comment = await this.commentRepository.findOne(id)
        if (comment) {
            comment.action = data.action
            comment.text = data.text
            await this.commentRepository.save(comment)
            return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
        }
        throw new NotFoundException()
    }

    async deleteComment(id: string): Promise<Comment> {
        const comment = await this.commentRepository.findOne(id)
        if (comment) {
            comment.deleted = true
            await this.commentRepository.save(comment)
            return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
        }
        throw new NotFoundException()
    }
}