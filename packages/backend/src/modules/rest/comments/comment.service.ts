import * as fs from 'fs'

import { Injectable } from '@nestjs/common'
import { Client, ClientProxy, Transport } from '@nestjs/microservices'

import * as shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import { CommentEntity, Database } from 'productboard-database'

@Injectable()
export class CommentService implements CommentREST<CommentAddData, CommentUpdateData, Express.Multer.File[]> {
    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    async findComments(issueId: string): Promise<Comment[]> {
        let where: FindOptionsWhere<CommentEntity>
        if (issueId)
            where = { issueId, deleted: false }
        const result: Comment[] = []
        for (const comment of await Database.get().commentRepository.findBy(where))
            result.push(this.convert(comment))
        return result
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async addComment(data: CommentAddData, files: { audio?: Express.Multer.File[] }): Promise<Comment> {
        let comment: CommentEntity
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            comment = await Database.get().commentRepository.save({ id: shortid(), deleted: false, audioId: shortid(), ...data })
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${comment.audioId}.webm`, files.audio[0].buffer)
        } else {
            comment = await Database.get().commentRepository.save({ id: shortid(), deleted: false, ...data })

        }
        await this.client.emit(`/api/v1/comments/${comment.id}/create`, this.convert(comment))
        return this.convert(comment)
    }

    async getComment(id: string): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        return this.convert(comment)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Express.Multer.File[] }): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        comment.action = data.action
        comment.text = data.text
        await Database.get().commentRepository.save(comment)
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${comment.audioId}.webm`, files.audio[0].buffer)
        }
        await this.client.emit(`/api/v1/comments/${comment.id}/update`, this.convert(comment))
        return this.convert(comment)
    }

    async deleteComment(id: string): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        comment.deleted = true
        await Database.get().commentRepository.save(comment)
        await this.client.emit(`/api/v1/comments/${comment.id}/delete`, this.convert(comment))
        return this.convert(comment)
    }

    private convert(comment: CommentEntity) {
        return { id: comment.id, deleted: comment.deleted, audioId: comment.audioId, userId: comment.userId, issueId: comment.issueId, creationDate: comment.creationDate, text: comment.text, action: comment.action }
    }
}