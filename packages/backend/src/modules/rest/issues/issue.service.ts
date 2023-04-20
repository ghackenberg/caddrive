import * as fs from 'fs'

import { Injectable } from '@nestjs/common'
import { Client, ClientProxy, Transport } from '@nestjs/microservices'

import * as shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'
import { Database, IssueEntity } from 'productboard-database'

@Injectable()
export class IssueService implements IssueREST<IssueAddData, IssueUpdateData, Express.Multer.File[]> {
    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    async findIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') : Promise<Issue[]> {
        let where: FindOptionsWhere<IssueEntity>
        if (productId && milestoneId && state)
            where = { productId, milestoneId, state, deleted: false }
        else if (productId && milestoneId)
            where = { productId, milestoneId, deleted: false }
        else if (productId && state)
            where = { productId, state, deleted: false }
        else if (productId)
            where = { productId, deleted: false }
        const result: Issue[] = []
        for (const issue of await Database.get().issueRepository.findBy(where))
            result.push(this.convert(issue))
        return result
    }
  
    async addIssue(data: IssueAddData, files: { audio?: Express.Multer.File[] }): Promise<Issue> {
        let issue: IssueEntity
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            issue = await Database.get().issueRepository.save({ id: shortid(), deleted: false, audioId: shortid(), ...data })
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${issue.audioId}.webm`, files.audio[0].buffer)
        } else {
            issue = await Database.get().issueRepository.save({ id: shortid(), deleted: false, ...data })
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
        issue.assigneeIds = data.assigneeIds
        issue.name = data.name
        issue.milestoneId =  data.milestoneId
        issue.state = data.state
        issue.description = data.description
        await Database.get().issueRepository.save(issue)
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${issue.audioId}.webm`, files.audio[0].buffer)
        }
        await this.client.emit(`/api/v1/issues/${issue.id}/update`, this.convert(issue))
        return this.convert(issue)
    }

    async deleteIssue(id: string): Promise<Issue> {
        const issue = await Database.get().issueRepository.findOneByOrFail({ id })
        await Database.get().commentRepository.update({ issueId: issue.id }, { deleted: true })
        issue.deleted = true
        await Database.get().issueRepository.save(issue)
        await this.client.emit(`/api/v1/issues/${issue.id}/delete`, this.convert(issue))
        return this.convert(issue)
    }

    private convert(issue: IssueEntity) {
        return {id: issue.id, deleted: issue.deleted, parentIssueId: issue.parentIssueId, stateId: issue.stateId, issueTypeId: issue.issueTypeId, modificationDate: issue.modificationDate, priority: issue.priority, storypoints: issue.storypoints, process: issue.progress, audioId: issue.audioId, userId: issue.userId, productId: issue.productId, creationDate: issue.creationDate, name: issue.name, description: issue.description, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId}
    }
}