import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import { CommentEntity, Database } from 'productboard-database'

import { convertComment } from '../../../functions/convert'
import { AuthorizedRequest } from '../../../request'

@Injectable()
export class CommentService implements CommentREST<CommentAddData, CommentUpdateData, Express.Multer.File[]> {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }

    async findComments(issueId: string): Promise<Comment[]> {
        let where: FindOptionsWhere<CommentEntity>
        if (issueId)
            where = { issueId, deleted: IsNull() }
        const result: Comment[] = []
        for (const comment of await Database.get().commentRepository.findBy(where))
            result.push(convertComment(comment))
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
        if (comment.action != 'none') {
            const issue = await Database.get().issueRepository.findOneBy({ id: comment.issueId })
            issue.updated = Date.now()
            if (comment.action == 'close') {
                issue.state = 'closed'
                await Database.get().issueRepository.save(issue)
            } else if (comment.action == 'reopen') {
                issue.state = 'open'
                await Database.get().issueRepository.save(issue)
            }
        }
        return convertComment(comment)
    }

    async getComment(id: string): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        return convertComment(comment)
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
        return convertComment(comment)
    }

    async deleteComment(id: string): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        comment.deleted = Date.now()
        await Database.get().commentRepository.save(comment)
        return convertComment(comment)
    }
}