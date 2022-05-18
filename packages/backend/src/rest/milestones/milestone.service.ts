import { Injectable, NotFoundException } from '@nestjs/common'
import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { IssueRepository, MilestoneRepository } from 'productboard-database'
import * as shortid from 'shortid'

@Injectable()
export class MilestoneService implements MilestoneREST {
    async findMilestones(productId: string): Promise<Milestone[]> {
        const result: Milestone[] = []
        const where = { deleted: false, productId }
        for (const milestone of await MilestoneRepository.find({ where })) {
            result.push(milestone)
        }
        return result
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {   
        const milestone = await MilestoneRepository.save({ id: shortid(), deleted: false, ...data })
        return ({ id: milestone.id, deleted: milestone.deleted, userId: milestone.userId, productId: milestone.productId, label: milestone.label, start: milestone.start, end: milestone.end })
    }

    async getMilestone(id: string): Promise<Milestone> {
        const milestone = await MilestoneRepository.findOne({ where: { id } })
        if (milestone) {
            return ({ id: milestone.id, deleted: milestone.deleted, userId: milestone.userId, productId: milestone.productId, label: milestone.label, start: milestone.start, end: milestone.end })
        }
        throw new NotFoundException()
    }

    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        const milestone = await MilestoneRepository.findOne({ where: { id } })
        if (milestone) {
            milestone.label = data.label
            milestone.start = data.start
            milestone.end = data.end
            await MilestoneRepository.save(milestone)
            return ({ id: milestone.id, deleted: milestone.deleted, userId: milestone.userId, productId: milestone.productId, label: milestone.label, start: milestone.start, end: milestone.end })
        }
        throw new NotFoundException()
    }


    async deleteMilestone(id: string): Promise<Milestone> {
        const milestone = await MilestoneRepository.findOne({ where: { id } })
        if (milestone) {
            for (const issue of await IssueRepository.find({ where: { productId: milestone.productId, milestoneId: milestone.id } })) {
                issue.milestoneId = null
                await IssueRepository.save(issue)
            }
            milestone.deleted = true
            await MilestoneRepository.save(milestone)
            return ({ id: milestone.id, deleted: milestone.deleted, userId: milestone.userId, productId: milestone.productId, label: milestone.label, start: milestone.start, end: milestone.end })
        }
        throw new NotFoundException()
    }
}