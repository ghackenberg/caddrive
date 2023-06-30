import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'
import { Database, IssueEntity } from 'productboard-database'

import { convertIssue } from '../../../functions/convert'
import { emitComment, emitIssue } from '../../../functions/emit'
import { AuthorizedRequest } from '../../../request'

@Injectable()
export class IssueService implements IssueREST<IssueAddData, IssueUpdateData, Express.Multer.File[]> {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {
        if (!existsSync('./uploads')) {
            mkdirSync('./uploads')
        }
    }

    async findIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') : Promise<Issue[]> {
        let where: FindOptionsWhere<IssueEntity>
        if (productId && milestoneId && state)
            where = { productId, milestoneId, state, deleted: IsNull() }
        else if (productId && milestoneId)
            where = { productId, milestoneId, deleted: IsNull() }
        else if (productId && state)
            where = { productId, state, deleted: IsNull() }
        else if (productId)
            where = { productId, deleted: IsNull() }
        const result: Issue[] = []
        for (const issue of await Database.get().issueRepository.findBy(where))
            result.push(convertIssue(issue))
        return result
    }
  
    async addIssue(data: IssueAddData, files: { audio?: Express.Multer.File[] }): Promise<Issue> {
        // Add issue
        const id = shortid()
        const created = Date.now()
        const updated = created
        const userId = this.request.user.id
        const state = 'open'
        let audioId: string
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            audioId = shortid()
            writeFileSync(`./uploads/${audioId}.webm`, files.audio[0].buffer)
        }
        const issue = await Database.get().issueRepository.save({ id, created, updated, userId, audioId, state, ...data })
        // Emit changes
        emitIssue(issue)
        // Return issue
        return convertIssue(issue)
    }

    async getIssue(id: string): Promise<Issue> {
        const issue = await Database.get().issueRepository.findOneByOrFail({ id })
        return convertIssue(issue)
    }

    async updateIssue(id: string, data: IssueUpdateData, files?: { audio?: Express.Multer.File[] }): Promise<Issue> {
        // Update issue
        const issue = await Database.get().issueRepository.findOneByOrFail({ id })
        issue.updated = Date.now()
        issue.assigneeIds = data.assigneeIds
        issue.label = data.label
        issue.milestoneId =  data.milestoneId
        issue.text = data.text
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            writeFileSync(`./uploads/${issue.audioId}.webm`, files.audio[0].buffer)
        }
        await Database.get().issueRepository.save(issue)
        // Emit changes
        emitIssue(issue)
        // Return issue
        return convertIssue(issue)
    }

    async deleteIssue(id: string): Promise<Issue> {
        // Delete issue
        const issue = await Database.get().issueRepository.findOneByOrFail({ id })
        issue.deleted = Date.now()
        issue.updated = issue.deleted
        await Database.get().issueRepository.save(issue)
        // Delete comments
        const comments = await Database.get().commentRepository.findBy({ issueId: issue.id, deleted: IsNull() })
        for (const comment of comments) {
            comment.deleted = issue.deleted
            comment.updated = issue.updated
            await Database.get().commentRepository.save(comment)
        }
        // Emit changes
        emitIssue(issue)
        comments.forEach(emitComment)
        // Return issue
        return convertIssue(issue)
    }
}