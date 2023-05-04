import axios from 'axios'

import { TagAssignment, TagAssignmentAddData, TagAssignmentREST, TagAssignmentUpdateData } from 'productboard-common'

import { auth } from '../auth'

class TagAssignmentClientImpl implements TagAssignmentREST {
    async findTagAssignments(issue: string): Promise<TagAssignment[]> {
        return (await axios.get<TagAssignment[]>('/rest/tagassignments', { params: { issue }, ...auth } )).data
    }
    async addTagAssignment(data: TagAssignmentAddData): Promise<TagAssignment> {
        return (await axios.post<TagAssignment>('/rest/tagassignments', data, { ...auth })).data
    }
    async getTagAssignment(id: string): Promise<TagAssignment> {
        return (await axios.get<TagAssignment>(`/rest/tagassignments/${id}`, { ...auth })).data
    }
    async updateTagAssignment(id: string, data: TagAssignmentUpdateData): Promise<TagAssignment> {
        return (await axios.put<TagAssignment>(`/rest/tagassignments/${id}`, data, { ...auth })).data
    }
    async deleteTagAssignment(id: string): Promise<TagAssignment> {
        return (await axios.delete<TagAssignment>(`/rest/tagassignments/${id}`, { ...auth })).data
    }
}

export const TagAssignmentClient = new TagAssignmentClientImpl()