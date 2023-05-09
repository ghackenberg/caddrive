import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'

import { MilestoneClient } from '../clients/rest/milestone'
import { AbstractManager } from './abstract'

class MilestoneManagerImpl extends AbstractManager<Milestone> implements MilestoneREST {
    // CACHE

    findMilestonesFromCache(productId: string) { 
        return this.getFind(productId)
    }
    getMilestoneFromCache(milestoneId: string) { 
        return this.getItem(milestoneId)
    }

    // REST

    async findMilestones(productId: string) {
        return this.find(
            productId,
            () => MilestoneClient.findMilestones(productId),
            milestone => milestone.productId == productId
        )
    }
    async addMilestone(data: MilestoneAddData) {
        return this.add(MilestoneClient.addMilestone(data))
    }
    async getMilestone(id: string) {
        return this.get(id, () => MilestoneClient.getMilestone(id))
    }
    async updateMilestone(id: string, data: MilestoneUpdateData) {
        return this.update(id, MilestoneClient.updateMilestone(id, data))
    }
    async deleteMilestone(id: string) {
        return this.delete(id, MilestoneClient.deleteMilestone(id))
    }
}

export const MilestoneManager = new MilestoneManagerImpl()