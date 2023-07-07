import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { IsNull } from 'typeorm'

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'
import { Database, convertIssue } from 'productboard-database'

import { emitProductMessage } from '../../../functions/emit'
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

    async findIssues(productId: string) : Promise<Issue[]> {
        const where = { productId, deleted: IsNull() }
        const result: Issue[] = []
        for (const issue of await Database.get().issueRepository.findBy(where))
            result.push(convertIssue(issue))
        return result
    }
  
    async addIssue(productId: string, data: IssueAddData, files: { audio?: Express.Multer.File[] }): Promise<Issue> {
        // Add issue
        const issueId = shortid()
        const created = Date.now()
        const updated = created
        const userId = this.request.user.userId
        const state = 'open'
        let audioId: string
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            audioId = shortid()
            writeFileSync(`./uploads/${audioId}.webm`, files.audio[0].buffer)
        }
        const issue = await Database.get().issueRepository.save({ productId, issueId, created, updated, userId, audioId, state, ...data })
        // Emit changes
        emitProductMessage(productId, { type: 'patch', issues: [issue] })
        // Return issue
        return convertIssue(issue)
    }

    async getIssue(productId: string, issueId: string): Promise<Issue> {
        const issue = await Database.get().issueRepository.findOneByOrFail({ productId, issueId })
        return convertIssue(issue)
    }

    async updateIssue(productId: string, issueId: string, data: IssueUpdateData, files?: { audio?: Express.Multer.File[] }): Promise<Issue> {
        // Update issue
        const issue = await Database.get().issueRepository.findOneByOrFail({ productId, issueId })
        issue.updated = Date.now()
        issue.assignedUserIds = data.assignedUserIds
        issue.label = data.label
        issue.milestoneId =  data.milestoneId
        issue.text = data.text
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            writeFileSync(`./uploads/${issue.audioId}.webm`, files.audio[0].buffer)
        }
        await Database.get().issueRepository.save(issue)
        // Emit changes
        emitProductMessage(productId, { type: 'patch', issues: [issue] })
        // Return issue
        return convertIssue(issue)
    }

    async deleteIssue(productId: string, issueId: string): Promise<Issue> {
        // Delete issue
        const issue = await Database.get().issueRepository.findOneByOrFail({ productId, issueId })
        issue.deleted = Date.now()
        issue.updated = issue.deleted
        await Database.get().issueRepository.save(issue)
        // Delete comments
        const comments = await Database.get().commentRepository.findBy({ productId, issueId, deleted: IsNull() })
        for (const comment of comments) {
            comment.deleted = issue.deleted
            comment.updated = issue.updated
            await Database.get().commentRepository.save(comment)
        }
        // Emit changes
        emitProductMessage(productId, { type: 'patch', issues: [issue], comments })
        // Return issue
        return convertIssue(issue)
    }
}