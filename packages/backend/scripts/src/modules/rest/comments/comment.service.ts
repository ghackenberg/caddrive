import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { CommentREST, Comment, CommentAddData, CommentUpdateData } from 'productboard-common'
import { CommentEntity, Database } from 'productboard-database'

import { convertComment } from '../../../functions/convert'
import { emitComment, emitIssue } from '../../../functions/emit'
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
        // Create comment
        const id = shortid()
        const created = Date.now()
        const updated = created
        const userId = this.request.user.id
        let audioId: string
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            audioId = shortid()
            writeFileSync(`./uploads/${audioId}.webm`, files.audio[0].buffer)
        }
        const comment = await Database.get().commentRepository.save({ id, created, updated, userId, audioId, ...data })
        // Update issue
        const issue = await Database.get().issueRepository.findOneBy({ id: comment.issueId })
        issue.updated = comment.updated
        if (comment.action == 'close') {
            issue.state = 'closed'
        } else if (comment.action == 'reopen') {
            issue.state = 'open'
        }
        await Database.get().issueRepository.save(issue)
        // Emit changes
        emitComment(comment)
        emitIssue(issue)
        // Return comment
        return convertComment(comment)
    }

    async getComment(id: string): Promise<Comment> {
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        return convertComment(comment)
    }
    
    async updateComment(id: string, data: CommentUpdateData, files?: { audio?: Express.Multer.File[] }): Promise<Comment> {
        // Update comment
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        comment.updated = Date.now()
        comment.action = data.action
        comment.text = data.text
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            writeFileSync(`./uploads/${comment.audioId}.webm`, files.audio[0].buffer)
        }
        await Database.get().commentRepository.save(comment)
        // Update issue
        const issue = await Database.get().issueRepository.findOneBy({ id: comment.issueId })
        issue.updated = comment.updated
        // TODO update state?
        await Database.get().issueRepository.save(issue)
        // Emit changes
        emitComment(comment)
        emitIssue(issue)
        // Return comment
        return convertComment(comment)
    }

    async deleteComment(id: string): Promise<Comment> {
        // Update comment
        const comment = await Database.get().commentRepository.findOneByOrFail({ id })
        comment.deleted = Date.now()
        comment.updated = comment.deleted
        await Database.get().commentRepository.save(comment)
        // Update issue
        const issue = await Database.get().issueRepository.findOneBy({ id: comment.issueId })
        issue.updated = comment.updated
        // TODO update state?
        await Database.get().issueRepository.save(issue)
        // Emit changes
        emitComment(comment)
        emitIssue(issue)
        // Return comment
        return convertComment(comment)
    }
}