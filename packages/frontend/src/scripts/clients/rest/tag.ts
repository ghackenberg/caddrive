import axios from 'axios'

import { Tag, TagAddData, TagREST, TagUpdateData } from 'productboard-common'

import { auth } from '../auth'

class TagClientImpl implements TagREST {
    async findTags(product: string): Promise<Tag[]> {
        return (await axios.get<Tag[]>('/rest/tags', { params: { product }, ...auth } )).data
    }
    async addTag(data: TagAddData): Promise<Tag> {
        return (await axios.post<Tag>('/rest/tags', data, { ...auth })).data
    }
    async getTag(id: string): Promise<Tag> {
        return (await axios.get<Tag>(`/rest/tags/${id}`, { ...auth })).data
    }
    async updateTag(id: string, data: TagUpdateData): Promise<Tag> {
        return (await axios.put<Tag>(`/rest/tags/${id}`, data, { ...auth })).data
    }
    async deleteTag(id: string): Promise<Tag> {
        return (await axios.delete<Tag>(`/rest/tags/${id}`, { ...auth })).data
    }
}

export const TagClient = new TagClientImpl()