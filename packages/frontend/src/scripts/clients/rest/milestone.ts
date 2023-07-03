import axios from 'axios'

import { Milestone, MilestoneAddData, MilestoneREST, MilestoneUpdateData } from 'productboard-common'

import { auth } from '../auth'
import { MqttAPI } from '../mqtt'

class MilestoneClientImpl implements MilestoneREST {
    async findMilestones(productId: string): Promise<Milestone[]> {
        return (await axios.get<Milestone[]>(`/rest/products/${productId}/milestones`, auth)).data
    }
    async addMilestone(productId: string, data: MilestoneAddData): Promise<Milestone> {
        const milestone = (await axios.post<Milestone>(`/rest/products/${productId}/milestones`, data, auth)).data
        MqttAPI.publishMilestoneLocal(milestone)
        return milestone
    }
    async getMilestone(productId: string, milestoneId: string): Promise<Milestone> {
        return (await axios.get<Milestone>(`/rest/products/${productId}/milestones/${milestoneId}`, auth)).data
    }
    async updateMilestone(productId: string, milestoneId: string, data: MilestoneUpdateData): Promise<Milestone> {
        const milestone = (await axios.put<Milestone>(`/rest/products/${productId}/milestones/${milestoneId}`, data, auth)).data
        MqttAPI.publishMilestoneLocal(milestone)
        return milestone
    }
    async deleteMilestone(productId: string, milestoneId: string): Promise<Milestone> {
        const milestone = (await axios.delete<Milestone>(`/rest/products/${productId}/milestones/${milestoneId}`, auth)).data
        MqttAPI.publishMilestoneLocal(milestone)
        return milestone
    }
}

export const MilestoneClient = new MilestoneClientImpl()