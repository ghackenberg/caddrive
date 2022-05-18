import { Injectable } from '@nestjs/common'
import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { IssueRepository, MilestoneEntity, MilestoneRepository } from 'productboard-database'
import * as shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

@Injectable()
export class MilestoneService implements MilestoneREST {
    async findMilestones(productId: string): Promise<Milestone[]> {
        const where: FindOptionsWhere<MilestoneEntity>[] = []
        if (productId)
            where.push({ productId })
        if (true)
            where.push({ deleted: false })
        const result: Milestone[] = []
        for (const milestone of await MilestoneRepository.findBy(where))
            result.push(this.convert(milestone))
        return result
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {   
        const milestone = await MilestoneRepository.save({ id: shortid(), deleted: false, ...data })
        return this.convert(milestone)
    }

    async getMilestone(id: string): Promise<Milestone> {
        const milestone = await MilestoneRepository.findOneByOrFail({ id })
        return this.convert(milestone)
    }

    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        const milestone = await MilestoneRepository.findOneByOrFail({ id })
        milestone.label = data.label
        milestone.start = data.start
        milestone.end = data.end
        await MilestoneRepository.save(milestone)
        return this.convert(milestone)
    }

    async deleteMilestone(id: string): Promise<Milestone> {
        const milestone = await MilestoneRepository.findOneByOrFail({ id })
        await IssueRepository.update({ milestoneId: milestone.id }, { milestoneId: null })
        milestone.deleted = true
        await MilestoneRepository.save(milestone)
        return this.convert(milestone)
    }

    private convert(milestone: MilestoneEntity) {
        return { id: milestone.id, deleted: milestone.deleted, userId: milestone.userId, productId: milestone.productId, label: milestone.label, start: milestone.start, end: milestone.end }
    }
}