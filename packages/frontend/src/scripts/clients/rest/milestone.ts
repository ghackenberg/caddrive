import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'

class MilestoneClientImpl implements MilestoneREST {
    async findMilestones(_productId: string): Promise<Milestone[]> {
        throw new Error('Method not implemented.')
    }
    async addMilestone(_data: MilestoneAddData): Promise<Milestone> {
        throw new Error('Method not implemented.')
    }
    async getMilestone(_id: string): Promise<Milestone> {
        throw new Error('Method not implemented.')
    }
    async updateMilestone(_id: string, _data: MilestoneUpdateData): Promise<Milestone> {
        throw new Error('Method not implemented.')
    }
    async deleteMilestone(_id: string): Promise<Milestone> {
        throw new Error('Method not implemented.')
    }
}

export const MilestoneClient = new MilestoneClientImpl()