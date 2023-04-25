import { existsSync, mkdirSync, writeFileSync } from 'fs'

import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'

import { Request } from 'express'
import shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Issue, IssueAddData, IssueUpdateData, IssueREST, User } from 'productboard-common'
import { Database, IssueEntity } from 'productboard-database'

@Injectable()
export class IssueService implements IssueREST<IssueAddData, IssueUpdateData, Express.Multer.File[]> {
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

    async findIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') : Promise<Issue[]> {
        let where: FindOptionsWhere<IssueEntity>
        if (productId && milestoneId && state)
            where = { productId, milestoneId, state, deleted: null }
        else if (productId && milestoneId)
            where = { productId, milestoneId, deleted: null }
        else if (productId && state)
            where = { productId, state, deleted: null }
        else if (productId)
            where = { productId, deleted: null }
        const result: Issue[] = []
        for (const issue of await Database.get().issueRepository.findBy(where))
            result.push(this.convert(issue))
        return result
    }
  
    async addIssue(data: IssueAddData, files: { audio?: Express.Multer.File[] }): Promise<Issue> {
        const id = shortid()
        const created = Date.now()
        const userId = this.request.user.id
        let issue: IssueEntity
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            const audioId = shortid()
            issue = await Database.get().issueRepository.save({ id, created, userId, audioId, ...data })
            writeFileSync(`./uploads/${issue.audioId}.webm`, files.audio[0].buffer)
        } else {
            issue = await Database.get().issueRepository.save({ id, created, userId, ...data })
        }
        await this.client.emit(`/api/v1/issues/${issue.id}/create`, this.convert(issue))
        return this.convert(issue)
    }

    async getIssue(id: string): Promise<Issue> {
        const issue = await Database.get().issueRepository.findOneByOrFail({ id })
        return this.convert(issue)
    }

    async updateIssue(id: string, data: IssueUpdateData, files?: { audio?: Express.Multer.File[] }): Promise<Issue> {
        const issue = await Database.get().issueRepository.findOneByOrFail({ id })
        issue.updated = Date.now()
        issue.assigneeIds = data.assigneeIds
        issue.name = data.name
        issue.milestoneId =  data.milestoneId
        issue.state = data.state
        issue.description = data.description
        await Database.get().issueRepository.save(issue)
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            writeFileSync(`./uploads/${issue.audioId}.webm`, files.audio[0].buffer)
        }
        await this.client.emit(`/api/v1/issues/${issue.id}/update`, this.convert(issue))
        return this.convert(issue)
    }

    async deleteIssue(id: string): Promise<Issue> {
        const issue = await Database.get().issueRepository.findOneByOrFail({ id })
        await Database.get().commentRepository.update({ issueId: issue.id }, { deleted: Date.now() })
        issue.deleted = Date.now()
        await Database.get().issueRepository.save(issue)
        await this.client.emit(`/api/v1/issues/${issue.id}/delete`, this.convert(issue))
        return this.convert(issue)
    }

    private convert(issue: IssueEntity): Issue {
        return {
            id: issue.id, 
            created: issue.created, 
            updated: issue.updated, 
            deleted: issue.deleted, 
            audioId: issue.audioId, 
            userId: issue.userId, 
            productId: issue.productId, 
            name: issue.name, 
            description: issue.description,
            state: issue.state, 
            assigneeIds: issue.assigneeIds, 
            milestoneId: issue.milestoneId,
            stateId: issue.stateId,
            parentIssueId: issue.parentIssueId,
            issueTypeId: issue.issueTypeId,
            priority: issue.priority,
            progress: issue.progress,
            storypoints: issue.storypoints
        }
    }
}