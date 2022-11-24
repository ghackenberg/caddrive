import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'

import { MilestoneClient } from '../clients/rest/milestone'

class MilestoneManagerImpl implements MilestoneREST {
    private milestoneIndex: {[id: string]: Milestone} = {}
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}

    getMilestoneCount(productId: string) { 
        if (productId in this.findIndex) { 
            return Object.keys(this.findIndex[productId]).length 
        } else { 
            return undefined 
        } 
    }

    findMilestonesFromCache(productId: string) { 
        if (productId in this.findIndex) { 
            return Object.keys(this.findIndex[productId]).map(id => this.milestoneIndex[id])
        } else { 
            return undefined 
        } 
    }

    async findMilestones(productId: string): Promise<Milestone[]> {
        if (!(productId in this.findIndex)) {
            // Call backend
            const milestones = await MilestoneClient.findMilestones(productId)
            // Update issue index
            for (const milestone of milestones) {
                this.milestoneIndex[milestone.id] = milestone
            }
            // Update product index
            this.findIndex[productId] = {}
            for (const milestone of milestones) {
                this.findIndex[productId][milestone.id] = true
            }
        }
        // Return issues
        return Object.keys(this.findIndex[productId]).map(id => this.milestoneIndex[id])
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {
        const milestone = await MilestoneClient.addMilestone(data)
        this.milestoneIndex[milestone.id] = milestone
        if (milestone.productId in this.findIndex) {
            this.findIndex[milestone.productId][milestone.id] = true 
        }
        return milestone
    }

    getMilestoneFromCache(milestoneId: string) { 
        if (milestoneId in this.milestoneIndex) { 
            return this.milestoneIndex[milestoneId]
        } else { 
            return undefined 
        } 
    }

    async getMilestone(id: string): Promise<Milestone> {
        if (!(id in this.milestoneIndex)) {
            const milestone = await MilestoneClient.getMilestone(id)
            this.milestoneIndex[id] = milestone

        }
        return this.milestoneIndex[id]

    }
    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        const milestone = await MilestoneClient.updateMilestone(id, data)
        this.milestoneIndex[id] = milestone
        return milestone
    }
    async deleteMilestone(id: string): Promise<Milestone> {
        const milestone = await MilestoneClient.deleteMilestone(id)
        this.milestoneIndex[id] = milestone
        if (milestone.productId in this.findIndex) {
            delete this.findIndex[milestone.productId][id]
        }
        return milestone
    }
}

export const MilestoneManager = new MilestoneManagerImpl()