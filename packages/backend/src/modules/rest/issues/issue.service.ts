import * as fs from 'fs'

import { Injectable } from '@nestjs/common'
import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'
import { CommentRepository, IssueEntity, IssueRepository } from 'productboard-database'
import * as shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

@Injectable()
export class IssueService implements IssueREST<IssueAddData, IssueUpdateData, Express.Multer.File[]> {
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
        for (const issue of await IssueRepository.findBy(where))
            result.push(this.convert(issue))
        return result
    }
  
    async addIssue(data: IssueAddData, files: { audio?: Express.Multer.File[] }): Promise<Issue> {
        const issue = await IssueRepository.save({ id: shortid(), deleted: false, ...data })
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${issue.id}.webm`, files.audio[0].buffer)
        }
        return this.convert(issue)
    }

    async getIssue(id: string): Promise<Issue> {
        const issue = await IssueRepository.findOneByOrFail({ id })
        return this.convert(issue)
    }

    async updateIssue(id: string, data: IssueUpdateData, files?: { audio?: Express.Multer.File[] }): Promise<Issue> {
        const issue = await IssueRepository.findOneByOrFail({ id })
        issue.assigneeIds = data.assigneeIds
        issue.label = data.label
        issue.milestoneId =  data.milestoneId
        issue.state = data.state
        issue.text = data.text
        await IssueRepository.save(issue)
        if (files && files.audio && files.audio.length == 1 && files.audio[0].mimetype.endsWith('/webm')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${issue.id}.webm`, files.audio[0].buffer)
        }
        return this.convert(issue)
    }

    async deleteIssue(id: string): Promise<Issue> {
        const issue = await IssueRepository.findOneByOrFail({ id })
        await CommentRepository.update({ issueId: issue.id }, { deleted: true })
        issue.deleted = true
        await IssueRepository.save(issue)
        return this.convert(issue)
    }

    private convert(issue: IssueEntity) {
        return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
    }
}