import { Injectable } from '@nestjs/common'
import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import { CommentEntity, CommentRepository } from 'productboard-database'
import * as shortid from 'shortid'

@Injectable()
export class CommentService implements CommentREST { 
    async findComments(issueId: string): Promise<Comment[]> {
        const result: Comment[] = []
        const where = { deleted:false, issueId }
        for (const comment of await CommentRepository.find({ where })) {
            result.push(this.convert(comment))
        }
        return result
    }

    async addComment(data: CommentAddData): Promise<Comment> {
        const comment = await CommentRepository.save({ id: shortid(), deleted: false, ...data })
        return this.convert(comment)
    }

    async getComment(id: string): Promise<Comment> {
        const comment = await CommentRepository.findOneByOrFail({ id })
        return this.convert(comment)
    }

    async updateComment(id: string, data: CommentUpdateData): Promise<Comment> {
        const comment = await CommentRepository.findOneByOrFail({ id })
        comment.action = data.action
        comment.text = data.text
        await CommentRepository.save(comment)
        return this.convert(comment)
    }

    async deleteComment(id: string): Promise<Comment> {
        const comment = await CommentRepository.findOneByOrFail({ id })
        comment.deleted = true
        await CommentRepository.save(comment)
        return this.convert(comment)
    }

    private convert(comment: CommentEntity) {
        return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
    }
}