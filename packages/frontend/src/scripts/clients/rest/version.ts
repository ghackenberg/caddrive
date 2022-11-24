import axios from 'axios'
import { Version, VersionAddData, VersionUpdateData, VersionREST } from 'productboard-common'

import { auth } from '../auth'

class VersionClientImpl implements VersionREST<VersionAddData, VersionUpdateData, File, Blob> {
    async findVersions(product: string): Promise<Version[]> {
        return (await axios.get<Version[]>('/rest/versions', { params: { product }, auth } )).data
    }
    async addVersion(data: VersionAddData, files: {model: File, image: Blob}): Promise<Version> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('model', files.model)
        body.append('image', files.image)
        return (await axios.post<Version>('/rest/versions', body, { auth })).data
    }
    async getVersion(id: string): Promise<Version> {
        return (await axios.get<Version>(`/rest/versions/${id}`, { auth })).data
    }
    async updateVersion(id: string, data: VersionUpdateData, files?: {model: File, image: Blob}): Promise<Version> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files) {
            body.append('model', files.model)
            body.append('image', files.image)
        }
        return (await axios.put<Version>(`/rest/versions/${id}`, body, { auth })).data
    }
    async deleteVersion(id: string): Promise<Version> {
        return (await axios.delete<Version>(`/rest/versions/${id}`, { auth })).data
    }
}

export const VersionClient = new VersionClientImpl()