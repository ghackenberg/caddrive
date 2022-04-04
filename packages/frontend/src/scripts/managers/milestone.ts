import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'
import { MilestoneClient } from '../clients/rest/milestone'

class MilestoneManagerImpl implements MilestoneREST {
    async findMilestones(productId: string): Promise<Milestone[]> {
        return MilestoneClient.findMilestones(productId)
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