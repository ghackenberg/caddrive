import axios from 'axios'
import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'

import { auth } from '../auth'

class MilestoneClientImpl implements MilestoneREST {
    async findMilestones(product: string): Promise<Milestone[]> {
        return (await axios.get<Milestone[]>('/rest/milestones', { params: { product }, auth } )).data
    }
    async addMilestone(data: MilestoneAddData): Promise<Milestone> {
        return (await axios.post<Milestone>('/rest/milestones', data, { auth })).data
    }
    async getMilestone(id: string): Promise<Milestone> {
        return (await axios.get<Milestone>(`/rest/milestones/${id}`, { auth })).data
    }
    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        return (await axios.put<Milestone>(`/rest/milestones/${id}`, data, { auth })).data
    }
    async deleteMilestone(id: string): Promise<Milestone> {
        return (await axios.delete<Milestone>(`/rest/milestones/${id}`, { auth })).data
    }
}

export const MilestoneClient = new MilestoneClientImpl()