import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { MilestoneClient } from '../clients/rest/milestone'

class MilestoneManagerImpl implements MilestoneREST {
    private milestoneIndex: {[id: string]: Milestone} = {}
    private productIndex: {[id: string]: {[id: string]: boolean}} = {}

    getMilestoneCount(productId: string) { 
        if (productId in this.productIndex) { 
            return Object.keys(this.productIndex[productId]).length 
        } else { 
            return undefined 
        } 
    }

    async findMilestones(productId: string): Promise<Milestone[]> {

        //delete this.productIndex[productId]

        if (!(productId in this.productIndex)) {
            // Call backend
            const milestones = await MilestoneClient.findMilestones(productId)
            // Update issue index
            for (const milestone of milestones) {
                this.milestoneIndex[milestone.id] = milestone
            }
            // Update product index
            this.productIndex[productId] = {}
            for (const milestone of milestones) {
                this.productIndex[productId][milestone.id] = true
            }
        }
        // Return issues
        return Object.keys(this.productIndex[productId]).map(id => this.milestoneIndex[id])
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {
        return MilestoneClient.addMilestone(data)
    }
    async getMilestone(id: string): Promise<Milestone> {
        return MilestoneClient.getMilestone(id)
    }
    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        return MilestoneClient.updateMilestone(id, data)
    }
    async deleteMilestone(id: string): Promise<Milestone> {
        return MilestoneClient.deleteMilestone(id)
    }
}

export const MilestoneManager = new MilestoneManagerImpl()