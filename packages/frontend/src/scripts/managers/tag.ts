import { Tag, TagAddData, TagDownMQTT, TagREST, TagUpdateData } from 'productboard-common'

import { TagAPI } from '../clients/mqtt/tag'
import { TagClient } from '../clients/rest/tag'
import { AbstractManager } from './abstract'

class TagManagerImpl extends AbstractManager<Tag> implements TagREST, TagDownMQTT {
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}

    constructor() {
        super()
        TagAPI.register(this)
    }

    // CACHE

    findTagsFromCache(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.load(id))
        } else { 
            return undefined 
        } 
    }
    getTagFromCache(tagId: string) { 
        return this.load(tagId)
    }

    private addToFindIndex(tag: Tag) {
        if (`${tag.productId}` in this.findIndex) {
            this.findIndex[`${tag.productId}`][tag.id] = true
        }
    }
    private removeFromFindIndex(tag: Tag) {
        for (const key of Object.keys(this.findIndex)) {
            if (tag.id in this.findIndex[key]) {
                delete this.findIndex[key][tag.id]
            }
        }
    }

    // MQTT

    create(tag: Tag): void {
        tag = this.store(tag)
        this.addToFindIndex(tag)
    }
    update(tag: Tag): void {
        tag = this.store(tag)
        this.removeFromFindIndex(tag)
        this.addToFindIndex(tag)
    }
    delete(tag: Tag): void {
        tag = this.store(tag)
        this.removeFromFindIndex(tag)
    }

    // REST

    async findTags(productId: string): Promise<Tag[]> {
        const key = `${productId}`
        if (!(key in this.findIndex)) {
            // Call backend
            let tags = await TagClient.findTags(productId)
            // Update tag index
            tags = tags.map(tag => this.store(tag))
            // Init product index
            this.findIndex[key] = {}
            // Update product index
            tags.forEach(tag => this.addToFindIndex(tag))
        }
        // Return issues
        return Object.keys(this.findIndex[key]).map(id => this.load(id)).filter(tag => !tag.deleted)
    }

    async addTag(data: TagAddData): Promise<Tag> {
        // Call backend
        let tag = await TagClient.addTag(data)
        // Update tag index
        tag = this.store(tag)
        // Update find index
        this.addToFindIndex(tag)
        // Return tag
        return this.load(tag.id)
    }

    async getTag(id: string): Promise<Tag> {
        if (!this.has(id)) {
            // Call backend
            let tag = await TagClient.getTag(id)
            // Update tag index
            tag = this.store(tag)
            // Update product index
            this.addToFindIndex(tag)
        }
        // Return tag
        return this.load(id)

    }
    async updateTag(id: string, data: TagUpdateData): Promise<Tag> {
        // Call backend
        let tag = await TagClient.updateTag(id, data)
        // Update tag index
        tag = this.store(tag)
        // Update find index
        this.removeFromFindIndex(tag)
        this.addToFindIndex(tag)
        // Return tag
        return this.load(id)
    }
    async deleteTag(id: string): Promise<Tag> {
        // Call backend
        let tag = await TagClient.deleteTag(id)
        // Update tag index
        tag = this.store(tag)
        // Update find index
        this.removeFromFindIndex(tag)
        // Return tag
        return this.load(id)
    }
}

export const TagManager = new TagManagerImpl()