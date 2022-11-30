import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'

import { MilestoneClient } from '../clients/rest/milestone'

class MilestoneManagerImpl implements MilestoneREST {
    private milestoneIndex: {[id: string]: Milestone} = {}
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}

    getMilestoneCount(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).length 
        } else { 
            return undefined 
        } 
    }

    findMilestonesFromCache(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.milestoneIndex[id])
        } else { 
            return undefined 
        } 
    }

    async findMilestones(productId: string): Promise<Milestone[]> {
        const key = `${productId}`
        if (!(key in this.findIndex)) {
            // Call backend
            const milestones = await MilestoneClient.findMilestones(productId)
            // Update milestone index
            for (const milestone of milestones) {
                this.milestoneIndex[milestone.id] = milestone
            }
            // Update product index
            this.findIndex[key] = {}
            for (const milestone of milestones) {
                this.findIndex[key][milestone.id] = true
            }
        }
        // Return issues
        return Object.keys(this.findIndex[key]).map(id => this.milestoneIndex[id])
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {
        // Call backend
        const milestone = await MilestoneClient.addMilestone(data)
        // Update milestone index
        this.milestoneIndex[milestone.id] = milestone
        // Update find index
        this.addToFindIndex(milestone)
        // Return milestone
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
            // Call backend
            const milestone = await MilestoneClient.getMilestone(id)
            // Update milestone index
            this.milestoneIndex[id] = milestone
        }
        // Return milestone
        return this.milestoneIndex[id]

    }
    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        // Call backend
        const milestone = await MilestoneClient.updateMilestone(id, data)
        // Update milestone index
        this.milestoneIndex[id] = milestone
        // Update find index
        this.removeFromFindIndex(milestone)
        this.addToFindIndex(milestone)
        // Return milestone
        return milestone
    }
    async deleteMilestone(id: string): Promise<Milestone> {
        // Call backend
        const milestone = await MilestoneClient.deleteMilestone(id)
        // Update milestone index
        this.milestoneIndex[id] = milestone
        // Update find index
        this.removeFromFindIndex(milestone)
        // Return milestone
        return milestone
    }

    private addToFindIndex(milestone: Milestone) {
        if (`${milestone.productId}` in this.findIndex) {
            this.findIndex[`${milestone.productId}`][milestone.id] = true
        }
    }

    private removeFromFindIndex(milestone: Milestone) {
        for (const key of Object.keys(this.findIndex)) {
            if (milestone.id in this.findIndex[key]) {
                delete this.findIndex[key][milestone.id]
            }
        }
    }
}

export const MilestoneManager = new MilestoneManagerImpl()