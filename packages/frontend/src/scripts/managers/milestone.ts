import { Milestone, MilestoneAddData, MilestoneDownMQTT, MilestoneREST, MilestoneUpdateData } from 'productboard-common'

import { MilestoneAPI } from '../clients/mqtt/milestone'
import { MilestoneClient } from '../clients/rest/milestone'
import { AbstractManager } from './abstract'

class MilestoneManagerImpl extends AbstractManager<Milestone> implements MilestoneREST, MilestoneDownMQTT {
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}

    constructor() {
        super()
        MilestoneAPI.register(this)
    }

    // CACHE

    override clear() {
        super.clear()
        this.findIndex = {}
    }

    findMilestonesFromCache(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.getResolveItem(id))
        } else { 
            return undefined 
        } 
    }
    getMilestoneFromCache(milestoneId: string) { 
        return this.getResolveItem(milestoneId)
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

    // MQTT

    create(milestone: Milestone): void {
        milestone = this.resolveItem(milestone)
        this.addToFindIndex(milestone)
    }
    update(milestone: Milestone): void {
        milestone = this.resolveItem(milestone)
        this.removeFromFindIndex(milestone)
        this.addToFindIndex(milestone)
    }
    delete(milestone: Milestone): void {
        milestone = this.resolveItem(milestone)
        this.removeFromFindIndex(milestone)
    }

    // REST

    async findMilestones(productId: string): Promise<Milestone[]> {
        const key = `${productId}`
        if (!(key in this.findIndex)) {
            // Call backend
            let milestones = await MilestoneClient.findMilestones(productId)
            // Update milestone index
            milestones = milestones.map(milestone => this.resolveItem(milestone))
            // Init product index
            this.findIndex[key] = {}
            // Update product index
            milestones.forEach(milestone => this.addToFindIndex(milestone))
        }
        // Return issues
        return Object.keys(this.findIndex[key]).map(id => this.getResolveItem(id)).filter(milestone => !milestone.deleted)
    }

    async addMilestone(data: MilestoneAddData): Promise<Milestone> {
        // Call backend
        let milestone = await MilestoneClient.addMilestone(data)
        // Update milestone index
        milestone = this.resolveItem(milestone)
        // Update find index
        this.addToFindIndex(milestone)
        // Return milestone
        return this.getResolveItem(milestone.id)
    }

    async getMilestone(id: string): Promise<Milestone> {
        if (!this.hasResolveItem(id)) {
            // Call backend
            let milestone = await MilestoneClient.getMilestone(id)
            // Update milestone index
            milestone = this.resolveItem(milestone)
            // Update product index
            this.addToFindIndex(milestone)
        }
        // Return milestone
        return this.getResolveItem(id)

    }
    async updateMilestone(id: string, data: MilestoneUpdateData): Promise<Milestone> {
        // Call backend
        let milestone = await MilestoneClient.updateMilestone(id, data)
        // Update milestone index
        milestone = this.resolveItem(milestone)
        // Update find index
        this.removeFromFindIndex(milestone)
        this.addToFindIndex(milestone)
        // Return milestone
        return this.getResolveItem(id)
    }
    async deleteMilestone(id: string): Promise<Milestone> {
        // Call backend
        let milestone = await MilestoneClient.deleteMilestone(id)
        // Update milestone index
        milestone = this.resolveItem(milestone)
        // Update find index
        this.removeFromFindIndex(milestone)
        // Return milestone
        return this.getResolveItem(id)
    }
}

export const MilestoneManager = new MilestoneManagerImpl()