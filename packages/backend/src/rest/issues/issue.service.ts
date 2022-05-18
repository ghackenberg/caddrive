import { Injectable, NotFoundException } from '@nestjs/common'
import { FindOptionsWhere } from 'typeorm'
import * as shortid from 'shortid'
import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'
import { CommentRepository, IssueEntity, IssueRepository } from 'productboard-database'

@Injectable()
export class IssueService implements IssueREST {
    async findIssues(productId: string, milestoneId?: string, state?: 'open' | 'closed') : Promise<Issue[]> {
        const result: Issue[] = []
        const where: FindOptionsWhere<IssueEntity>[] = [{ productId }]
        milestoneId && where.push({ milestoneId })
        state && where.push({ state })
        for (const issue of await IssueRepository.find({ where })) {
            result.push( {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId } )
        }
        return result
    }
  
    async addIssue(data: IssueAddData): Promise<Issue> {
        const issue = await IssueRepository.save({ id: shortid(), deleted: false, ...data })
        return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
    }

    async getIssue(id: string): Promise<Issue> {
        const issue = await IssueRepository.findOne({ where: { id } })
        if (issue) {
            return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
        }
        throw new NotFoundException()
    }

    async updateIssue(id: string, data: IssueUpdateData): Promise<Issue> {
        const issue = await IssueRepository.findOne({ where: { id } })
        if (issue) {
            issue.assigneeIds = data.assigneeIds
            issue.label = data.label
            issue.milestoneId =  data.milestoneId
            issue.state = data.state
            issue.text = data.text
            await IssueRepository.save(issue)
            return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
        }
        throw new NotFoundException()
    }

    async deleteIssue(id: string): Promise<Issue> {
        const issue = await IssueRepository.findOne({ where: { id } })
        if (issue) {
            for (const comment of await CommentRepository.find({ where: { issueId: issue.id } })) {
                comment.deleted = true
                await CommentRepository.save(comment)
            }
            issue.deleted = true
            await IssueRepository.save(issue)
            return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
        }
        throw new NotFoundException()
    }
}