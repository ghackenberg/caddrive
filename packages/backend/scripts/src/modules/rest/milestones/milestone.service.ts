import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { Database, MilestoneEntity } from 'productboard-database'

import { convertMilestone } from '../../../functions/convert'
import { emitIssue, emitMilestone } from '../../../functions/emit'
import { AuthorizedRequest } from '../../../request'

@Injectable()
export class MilestoneService implements MilestoneREST {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest
    ) {}

    async findMilestones(productId: string): Promise<Milestone[]> {
        let where: FindOptionsWhere<MilestoneEntity>
        if (productId)
            where = { productId, deleted: IsNull() }
        const result: Milestone[] = []
        for (const milestone of await Database.get().milestoneRepository.findBy(where))
            result.push(convertMilestone(milestone))
        return result
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {
        // Create milestone
        const id = shortid()
        const created = Date.now()
        const updated = created
        const userId = this.request.user.id
        const milestone = await Database.get().milestoneRepository.save({ id, created, updated, userId, ...data })
        // Emit changes
        emitMilestone(milestone)
        // Return milestone
        return convertMilestone(milestone)
    }

    async getMilestone(id: string): Promise<Milestone> {
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        return convertMilestone(milestone)
    }

    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        // Update milestone
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        milestone.updated = Date.now()
        milestone.label = data.label
        milestone.start = data.start
        milestone.end = data.end
        await Database.get().milestoneRepository.save(milestone)
        // Emit changes
        emitMilestone(milestone)
        // Return milestone
        return convertMilestone(milestone)
    }

    async deleteMilestone(id: string): Promise<Milestone> {
        // Delete milestone
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        milestone.deleted = Date.now()
        milestone.updated = milestone.deleted
        await Database.get().milestoneRepository.save(milestone)
        // Update issues
        const issues = await Database.get().issueRepository.findBy({ milestoneId: id })
        for (const issue of issues) {
            issue.updated = milestone.deleted
            issue.milestoneId = null
            await Database.get().issueRepository.save(issue)
        }
        // Emit changes
        emitMilestone(milestone)
        issues.forEach(emitIssue)
        // Return milestone
        return convertMilestone(milestone)
    }
}