import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { IsNull } from 'typeorm'

import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { Database } from 'productboard-database'

import { convertMilestone } from '../../../functions/convert'
import { emitProductMessage } from '../../../functions/emit'
import { AuthorizedRequest } from '../../../request'

@Injectable()
export class MilestoneService implements MilestoneREST {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    async findMilestones(productId: string): Promise<Milestone[]> {
        const where = { productId, deleted: IsNull() }
        const result: Milestone[] = []
        for (const milestone of await Database.get().milestoneRepository.findBy(where))
            result.push(convertMilestone(milestone))
        return result
    }

    async addMilestone(productId: string, data: MilestoneAddData): Promise<Milestone> {
        // Create milestone
        const milestoneId = shortid()
        const created = Date.now()
        const updated = created
        const userId = this.request.user.userId
        const milestone = await Database.get().milestoneRepository.save({ productId, milestoneId, created, updated, userId, ...data })
        // Emit changes
        emitProductMessage(productId, { milestones: [milestone] })
        // Return milestone
        return convertMilestone(milestone)
    }

    async getMilestone(productId: string, milestoneId: string): Promise<Milestone> {
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ productId, milestoneId })
        return convertMilestone(milestone)
    }

    async updateMilestone(productId: string, milestoneId: string, data: MilestoneUpdateData): Promise<Milestone> {
        // Update milestone
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ productId, milestoneId })
        milestone.updated = Date.now()
        milestone.label = data.label
        milestone.start = data.start
        milestone.end = data.end
        await Database.get().milestoneRepository.save(milestone)
        // Emit changes
        emitProductMessage(productId, { milestones: [milestone] })
        // Return milestone
        return convertMilestone(milestone)
    }

    async deleteMilestone(productId: string, milestoneId: string): Promise<Milestone> {
        // Delete milestone
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ productId, milestoneId })
        milestone.deleted = Date.now()
        milestone.updated = milestone.deleted
        await Database.get().milestoneRepository.save(milestone)
        // Update issues
        const issues = await Database.get().issueRepository.findBy({ milestoneId })
        for (const issue of issues) {
            issue.updated = milestone.deleted
            issue.milestoneId = null
            await Database.get().issueRepository.save(issue)
        }
        // Emit changes
        emitProductMessage(productId, { milestones: [milestone], issues })
        // Return milestone
        return convertMilestone(milestone)
    }
}