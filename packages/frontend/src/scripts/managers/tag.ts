import { Tag, TagAddData, TagUpdateData } from 'productboard-common'

import { TagClient } from '../clients/rest/tag'
import { AbstractManager } from './abstract'

class TagManagerImpl extends AbstractManager<Tag> {
    // CACHE

    findTagsFromCache(productId: string) { 
        return this.getFind(productId)
    }
    getTagFromCache(tagId: string) { 
        return this.getItem(tagId)
    }

    // REST

    findTags(productId: string, callback: (tags: Tag[], error?: string) => void) {
        return this.find(
            productId,
            () => TagClient.findTags(productId),
            tag => tag.productId == productId,
            callback
        )
    }
    async addTag(data: TagAddData) {
        return this.resolveItem(await TagClient.addTag(data))
    }
    getTag(id: string, callback: (tag: Tag, error?: string) => void) {
        return this.observeItem(id, () => TagClient.getTag(id), callback)
    }
    async updateTag(id: string, data: TagUpdateData) {
        return this.promiseItem(id, TagClient.updateTag(id, data))
    }
    async deleteTag(id: string) {
        return this.promiseItem(id, TagClient.deleteTag(id))
    }
}

export const TagManager = new TagManagerImpl()