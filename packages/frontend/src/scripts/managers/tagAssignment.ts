import { TagAssignment, TagAssignmentAddData, TagAssignmentDownMQTT, TagAssignmentREST, TagAssignmentUpdateData } from 'productboard-common'

import { TagAssignmentAPI } from '../clients/mqtt/tagAssignment'
import { TagAssignmentClient } from '../clients/rest/tagAssignment'
import { AbstractManager } from './abstract'

class TagAssignmentManagerImpl extends AbstractManager<TagAssignment> implements TagAssignmentREST, TagAssignmentDownMQTT {
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}

    constructor() {
        super()
        TagAssignmentAPI.register(this)
    }

    // CACHE

    findTagAssignmentsFromCache(issueId: string) { 
        const key = `${issueId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.load(id))
        } else { 
            return undefined 
        } 
    }
    getTagAssignmentFromCache(tagAssignmentId: string) { 
        return this.load(tagAssignmentId)
    }

    private addToFindIndex(tagAssignment: TagAssignment) {
        if (`${tagAssignment.issueId}` in this.findIndex) {
            this.findIndex[`${tagAssignment.issueId}`][tagAssignment.id] = true
        }
    }
    private removeFromFindIndex(tagAssignment: TagAssignment) {
        for (const key of Object.keys(this.findIndex)) {
            if (tagAssignment.id in this.findIndex[key]) {
                delete this.findIndex[key][tagAssignment.id]
            }
        }
    }

    // MQTT

    create(tagAssignment: TagAssignment): void {
        tagAssignment = this.store(tagAssignment)
        this.addToFindIndex(tagAssignment)
    }
    update(tagAssignment: TagAssignment): void {
        tagAssignment = this.store(tagAssignment)
        this.removeFromFindIndex(tagAssignment)
        this.addToFindIndex(tagAssignment)
    }
    delete(tagAssignment: TagAssignment): void {
        tagAssignment = this.store(tagAssignment)
        this.removeFromFindIndex(tagAssignment)
    }

    // REST

    async findTagAssignments(issueId: string): Promise<TagAssignment[]> {
        const key = `${issueId}`
        if (!(key in this.findIndex)) {
            // Call backend
            let tagAssignments = await TagAssignmentClient.findTagAssignments(issueId)
            // Update tagAssignment index
            tagAssignments = tagAssignments.map(tagAssignment => this.store(tagAssignment))
            // Init product index
            this.findIndex[key] = {}
            // Update product index
            tagAssignments.forEach(tagAssignment => this.addToFindIndex(tagAssignment))
        }
        // Return issues
        return Object.keys(this.findIndex[key]).map(id => this.load(id)).filter(tagAssignment => !tagAssignment.deleted)
    }

    async addTagAssignment(data: TagAssignmentAddData): Promise<TagAssignment> {
        // Call backend
        let tagAssignment = await TagAssignmentClient.addTagAssignment(data)
        // Update tagAssignment index
        tagAssignment = this.store(tagAssignment)
        // Update find index
        this.addToFindIndex(tagAssignment)
        // Return tagAssignment
        return this.load(tagAssignment.id)
    }

    async getTagAssignment(id: string): Promise<TagAssignment> {
        if (!this.has(id)) {
            // Call backend
            let tagAssignment = await TagAssignmentClient.getTagAssignment(id)
            // Update tagAssignment index
            tagAssignment = this.store(tagAssignment)
            // Update product index
            this.addToFindIndex(tagAssignment)
        }
        // Return tagAssignment
        return this.load(id)

    }
    async updateTagAssignment(id: string, data: TagAssignmentUpdateData): Promise<TagAssignment> {
        // Call backend
        let tagAssignment = await TagAssignmentClient.updateTagAssignment(id, data)
        // Update tagAssignment index
        tagAssignment = this.store(tagAssignment)
        // Update find index
        this.removeFromFindIndex(tagAssignment)
        this.addToFindIndex(tagAssignment)
        // Return tagAssignment
        return this.load(id)
    }
    async deleteTagAssignment(id: string): Promise<TagAssignment> {
        // Call backend
        let tagAssignment = await TagAssignmentClient.deleteTagAssignment(id)
        // Update tagAssignment index
        tagAssignment = this.store(tagAssignment)
        // Update find index
        this.removeFromFindIndex(tagAssignment)
        // Return tagAssignment
        return this.load(id)
    }
}

export const TagAssignmentManager = new TagAssignmentManagerImpl()