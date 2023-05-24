import { TagAssignment, TagAssignmentAddData, TagAssignmentUpdateData } from 'productboard-common'

import { TagAssignmentClient } from '../clients/rest/tagAssignment'
import { AbstractManager } from './abstract'

class TagAssignmentManagerImpl extends AbstractManager<TagAssignment> {
    // CACHE

    findTagAssignmentsFromCache(issueId?: string, tagId?: string) { 
        return this.getFind(`${issueId}-${tagId}`)
    }
    getTagAssignmentFromCache(tagAssignmentId: string) { 
        return this.getItem(tagAssignmentId)
    }

    // REST

    findTagAssignments(issueId: string, tagId: string, callback: (tagAssignments: TagAssignment[], error?: string) => void) {
        return this.find(
            `${issueId}-${tagId}`,
            () => TagAssignmentClient.findTagAssignments(issueId, tagId),
            tagAssignment => (!issueId || tagAssignment.issueId == issueId) && (!tagId || tagAssignment.tagId == tagId),
            (a, b) => a.created - b.created,
            callback
        )
    }
    async addTagAssignment(data: TagAssignmentAddData) {
        return this.resolveItem(await TagAssignmentClient.addTagAssignment(data))
    }
    getTagAssignment(id: string, callback: (tagAssignment: TagAssignment, error?: string) => void) {
        return this.observeItem(id, () => TagAssignmentClient.getTagAssignment(id), callback)
    }
    async updateTagAssignment(id: string, data: TagAssignmentUpdateData) {
        return this.promiseItem(id, TagAssignmentClient.updateTagAssignment(id, data))
    }
    async deleteTagAssignment(id: string) {
        return this.promiseItem(id, TagAssignmentClient.deleteTagAssignment(id))
    }
}

export const TagAssignmentManager = new TagAssignmentManagerImpl('tagAssignment')