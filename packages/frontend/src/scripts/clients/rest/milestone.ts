import axios from 'axios'

import { MilestoneCreate, MilestoneREST, MilestoneRead, MilestoneUpdate } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class MilestoneClientImpl implements MilestoneREST {
    async findMilestones(productId: string): Promise<MilestoneRead[]> {
        return (await axios.get<MilestoneRead[]>(`/rest/products/${productId}/milestones`, auth)).data
    }
    async addMilestone(productId: string, data: MilestoneCreate): Promise<MilestoneRead> {
        const milestone = (await axios.post<MilestoneRead>(`/rest/products/${productId}/milestones`, data, auth)).data
        CacheAPI.putMilestone(milestone)
        return milestone
    }
    async getMilestone(productId: string, milestoneId: string): Promise<MilestoneRead> {
        return (await axios.get<MilestoneRead>(`/rest/products/${productId}/milestones/${milestoneId}`, auth)).data
    }
    async updateMilestone(productId: string, milestoneId: string, data: MilestoneUpdate): Promise<MilestoneRead> {
        const milestone = (await axios.put<MilestoneRead>(`/rest/products/${productId}/milestones/${milestoneId}`, data, auth)).data
        CacheAPI.putMilestone(milestone)
        return milestone
    }
    async deleteMilestone(productId: string, milestoneId: string): Promise<MilestoneRead> {
        const milestone = (await axios.delete<MilestoneRead>(`/rest/products/${productId}/milestones/${milestoneId}`, auth)).data
        CacheAPI.putMilestone(milestone)
        return milestone
    }
}

export const MilestoneClient = new MilestoneClientImpl()