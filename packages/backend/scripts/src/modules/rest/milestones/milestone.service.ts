import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'

import shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { Database, MilestoneEntity } from 'productboard-database'

import { AuthorizedRequest } from '../../../request'

@Injectable()
export class MilestoneService implements MilestoneREST {
    constructor(
        @Inject(REQUEST)
        private readonly request: AuthorizedRequest,
        @Inject('MQTT')
        private readonly client: ClientProxy
    ) {

    }

    async findMilestones(productId: string): Promise<Milestone[]> {
        let where: FindOptionsWhere<MilestoneEntity>
        if (productId)
            where = { productId, deleted: null }
        const result: Milestone[] = []
        for (const milestone of await Database.get().milestoneRepository.findBy(where))
            result.push(this.convert(milestone))
        return result
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {
        const id = shortid()
        const created = Date.now()
        const userId = this.request.user.id
        const milestone = await Database.get().milestoneRepository.save({ id, created, userId, ...data })
        await this.client.emit(`/api/v1/milestones/${milestone.id}/create`, this.convert(milestone))
        return this.convert(milestone)
    }

    async getMilestone(id: string): Promise<Milestone> {
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        return this.convert(milestone)
    }

    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        milestone.updated = Date.now()
        milestone.label = data.label
        milestone.start = data.start
        milestone.end = data.end
        await Database.get().milestoneRepository.save(milestone)
        await this.client.emit(`/api/v1/milestones/${milestone.id}/update`, this.convert(milestone))
        return this.convert(milestone)
    }

    async deleteMilestone(id: string): Promise<Milestone> {
        const milestone = await Database.get().milestoneRepository.findOneByOrFail({ id })
        await Database.get().issueRepository.update({ milestoneId: milestone.id }, { milestoneId: null })
        milestone.deleted = Date.now()
        await Database.get().milestoneRepository.save(milestone)
        await this.client.emit(`/api/v1/milestones/${milestone.id}/delete`, this.convert(milestone))
        return this.convert(milestone)
    }

    private convert(milestone: MilestoneEntity) {
        return { id: milestone.id, created: milestone.created, updated: milestone.updated, deleted: milestone.deleted, userId: milestone.userId, productId: milestone.productId, label: milestone.label, start: milestone.start, end: milestone.end }
    }
}