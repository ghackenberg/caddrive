import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'

import { Request } from 'express'
import shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { CommentREST, Comment, CommentAddData, CommentUpdateData, User } from 'productboard-common'
import { CommentEntity, Database } from 'productboard-database'

@Injectable()
export class CommentService implements CommentREST<CommentAddData, CommentUpdateData, Express.Multer.File[]> {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request & { user: User & { permissions: string[] } },
        @Inject('MQTT')
        private readonly client: ClientProxy
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }

    async findComments(issueId: string): Promise<Comment[]> {
        let where: FindOptionsWhere<CommentEntity>
        if (issueId)
            where = { issueId, deleted: null }
        const result: Comment[] = []
        for (const comment of await Database.get().commentRepository.findBy(where))
            result.push(this.convert(comment))
        return result
    }

    async addComment(data: CommentAddData, files: { audio?: Express.Multer.File[] }): Promise<Comment> {
        const id = shortid()
        const created = Date.now()
        const userId = this.request.user.id
        let comment: CommentEntity
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            const audioId = shortid()
            comment = await Database.get().commentRepository.save({ id, created, userId, audioId, ...data })
            writeFileSync(`./uploads/${comment.audioId}.webm`, files.audio[0].buffer)
        } else {
            comment = await Database.get().commentRepository.save({ id, created, userId, ...data })
        }
        await this.client.emit(`/api/v1/comments/${comment.id}/create`, this.convert(comment))
        return this.convert(comment)
    }

    async getComment(id: string): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        return this.convert(comment)
    }
    
    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Express.Multer.File[] }): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        comment.updated = Date.now()
        comment.action = data.action
        comment.text = data.text
        await Database.get().commentRepository.save(comment)
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            writeFileSync(`./uploads/${comment.audioId}.webm`, files.audio[0].buffer)
        }
        await this.client.emit(`/api/v1/comments/${comment.id}/update`, this.convert(comment))
        return this.convert(comment)
    }

    async deleteComment(id: string): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        comment.deleted = Date.now()
        await Database.get().commentRepository.save(comment)
        await this.client.emit(`/api/v1/comments/${comment.id}/delete`, this.convert(comment))
        return this.convert(comment)
    }

    private convert(comment: CommentEntity) {
        return { id: comment.id, created: comment.created, updated: comment.updated, deleted: comment.deleted, audioId: comment.audioId, userId: comment.userId, issueId: comment.issueId, text: comment.text, action: comment.action }
    }
}