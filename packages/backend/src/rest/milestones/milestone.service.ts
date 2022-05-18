import { NotFoundException } from '@nestjs/common'
import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { IssueRepository, MilestoneRepository } from 'productboard-database'
import * as shortid from 'shortid'

export class MilestoneService implements MilestoneREST {
    private static readonly milestones: Milestone[] = [
        { id: 'demo-1', userId: 'demo-1', productId: 'demo-1', label: 'Sprint 1', start: new Date('2022-04-11').toISOString(), end: new Date('2022-04-22').toISOString(), deleted: false},
        { id: 'demo-2', userId: 'demo-4', productId: 'demo-1', label: 'Sprint 2', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
        { id: 'demo-3', userId: 'demo-4', productId: 'demo-1', label: 'Sprint 3', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
        { id: 'demo-4', userId: 'demo-2', productId: 'demo-1', label: 'Sprint 4', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
        { id: 'demo-5', userId: 'demo-3', productId: 'demo-1', label: 'Sprint 5', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false}
    ]

    constructor() {
        MilestoneRepository.count().then(async count => {
            if (count == 0) {
                for (const _milestone of MilestoneService.milestones) {
                    //await this.milestoneRepository.save(milestone)
                }
            }
        })
    }

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