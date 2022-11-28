import { Injectable } from '@nestjs/common'
import { Client, ClientProxy, Transport } from '@nestjs/microservices'

import * as shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import { CommentEntity, CommentRepository } from 'productboard-database'

@Injectable()
export class CommentService implements CommentREST<CommentAddData, CommentUpdateData, Express.Multer.File[]> {
    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    async findComments(issueId: string): Promise<Comment[]> {
        let where: FindOptionsWhere<CommentEntity>
        if (issueId)
            where = { issueId, deleted: false }
        const result: Comment[] = []
        for (const comment of await CommentRepository.findBy(where))
            result.push(this.convert(comment))
        return result
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async addComment(data: CommentAddData, _files: { audio?: Express.Multer.File[] }): Promise<Comment> {
        // TODO save audio file and remove eslint comment
        const comment = await CommentRepository.save({ id: shortid(), deleted: false, ...data })
        await this.client.emit(`/api/v1/comments/${comment.id}/create`, this.convert(comment))
        return this.convert(comment)
    }

    async getComment(id: string): Promise<Comment> {
        const comment = await CommentRepository.findOneByOrFail({ id })
        return this.convert(comment)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateComment(id: string, data: CommentUpdateData, _files?: { audio?: Express.Multer.File[] }): Promise<Comment> {
        // TODO update audio file and remove eslint comment
        const comment = await CommentRepository.findOneByOrFail({ id })
        comment.action = data.action
        comment.text = data.text
        await CommentRepository.save(comment)
        await this.client.emit(`/api/v1/comments/${comment.id}/update`, this.convert(comment))
        return this.convert(comment)
    }

    async deleteComment(id: string): Promise<Comment> {
        const comment = await CommentRepository.findOneByOrFail({ id })
        comment.deleted = true
        await CommentRepository.save(comment)
        await this.client.emit(`/api/v1/comments/${comment.id}/delete`, this.convert(comment))
        return this.convert(comment)
    }

    private convert(comment: CommentEntity) {
        return { id: comment.id, deleted: comment.deleted, userId: comment.userId, issueId: comment.issueId, time: comment.time, text: comment.text, action: comment.action }
    }
}