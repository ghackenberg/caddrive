import { forwardRef, Inject, NotFoundException } from '@nestjs/common'
import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import * as shortid from 'shortid'
import { IssueService } from '../issues/issue.service'

export class MilestoneService implements MilestoneREST {
    private static readonly milestones: Milestone[] = [
        { id: shortid(), userId: 'demo-1', productId: 'demo-1', label: 'Sprint 1', start: new Date().toISOString(), end: new Date().toISOString(), deleted: false}
    ]

    constructor(
        @Inject(forwardRef(() => IssueService))
        private readonly issueService: IssueService
    ) {}

    async findMilestones(_productId: string): Promise<Milestone[]> {
        throw new Error('Method not implemented.')
    }

    async addMilestone(_data: MilestoneAddData): Promise<Milestone> {
        throw new Error('Method not implemented.')
    }

    async getMilestone(id: string): Promise<Milestone> {
        for (const milestone of MilestoneService.milestones) {
            if (milestone.id == id) {
                return milestone
            }
        }
        throw new NotFoundException()
    }

    async updateMilestone(_id: string, _data: MilestoneUpdateData): Promise<Milestone> {
        throw new Error('Method not implemented.')
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