import { forwardRef, Inject, NotFoundException } from '@nestjs/common'
import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import * as shortid from 'shortid'
import { IssueService } from '../issues/issue.service'

export class MilestoneService implements MilestoneREST {
    private static readonly milestones: Milestone[] = [
        { id: 'demo-1', userId: 'demo-1', productId: 'demo-1', label: 'Sprint 1', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
        { id: 'demo-2', userId: 'demo-4', productId: 'demo-1', label: 'Sprint 2', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
        { id: 'demo-3', userId: 'demo-4', productId: 'demo-1', label: 'Sprint 3', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
        { id: 'demo-4', userId: 'demo-2', productId: 'demo-1', label: 'Sprint 4', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false},
        { id: 'demo-5', userId: 'demo-3', productId: 'demo-1', label: 'Sprint 5', start: new Date(new Date().setHours(0,0,0,0)).toISOString(), end: new Date(new Date().setHours(0,0,0,0) + 1000 * 60 * 60 * 24 * 14).toISOString(), deleted: false}
    ]

    constructor(
        @Inject(forwardRef(() => IssueService))
        private readonly issueService: IssueService
    ) {}

    async findMilestones(productId: string): Promise<Milestone[]> {
        const result: Milestone[] = []
        for (const milestone of MilestoneService.milestones) {
            if (milestone.deleted) {
                continue
            }
            if (milestone.productId != productId) {
                continue
            }
            result.push(milestone)
        }
        return result
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {   
            const milestone = { id: shortid(), deleted: false, ...data }
            MilestoneService.milestones.push(milestone)
            return milestone
    }

    async getMilestone(id: string): Promise<Milestone> {
        for (const milestone of MilestoneService.milestones) {
            if (milestone.id == id) {
                return milestone
            }
        }
        throw new NotFoundException()
    }

    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        for (var index = 0; index < MilestoneService.milestones.length; index++) {
            const milestone = MilestoneService.milestones[index]
            if (milestone.id == id) {
                MilestoneService.milestones.splice(index, 1, { ...milestone,...data })
                return MilestoneService.milestones[index]
            }
        }
        throw new NotFoundException()
    }


    async deleteMilestone(_id: string): Promise<Milestone> {
        const milestone = await this.getMilestone(_id)
        for (const issue of await this.issueService.findIssues(milestone.productId, milestone.id)) {
            await this.issueService.updateIssue(issue.id, { ...issue, milestoneId: undefined })
        }
        milestone.deleted = true
        return milestone
    }
}