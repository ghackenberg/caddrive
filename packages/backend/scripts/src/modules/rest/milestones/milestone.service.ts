import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { Database, MilestoneEntity } from 'productboard-database'

import { convertMilestone } from '../../../functions/convert'
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
        const id = shortid()
        const created = Date.now()
        const userId = this.request.user.id
        const milestone = await Database.get().milestoneRepository.save({ id, created, userId, ...data })
        return convertMilestone(milestone)
    }

    async getMilestone(id: string): Promise<Milestone> {
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        return convertMilestone(milestone)
    }

    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        milestone.updated = Date.now()
        milestone.label = data.label
        milestone.start = data.start
        milestone.end = data.end
        await Database.get().milestoneRepository.save(milestone)
        return convertMilestone(milestone)
    }

    async deleteMilestone(id: string): Promise<Milestone> {
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        await Database.get().issueRepository.update({ milestoneId: milestone.id }, { milestoneId: null })
        milestone.deleted = Date.now()
        await Database.get().milestoneRepository.save(milestone)
        return convertMilestone(milestone)
    }
}