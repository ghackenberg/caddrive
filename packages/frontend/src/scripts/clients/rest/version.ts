import axios from 'axios'
// Commons
import { Version, VersionAddData, VersionUpdateData, VersionREST } from 'productboard-common'
// Globals
import { auth } from '../auth'

class VersionClientImpl implements VersionREST<VersionAddData, File, Blob> {
    async findVersions(product: string): Promise<Version[]> {
        return (await axios.get<Version[]>('/rest/versions', { params: { product }, auth } )).data
    }
    async addVersion(data: VersionAddData, model: File, image: Blob): Promise<Version> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('model', model)
        body.append('image', image)
        return (await axios.post<Version>('/rest/versions', body, { auth })).data
    }
    async getVersion(id: string): Promise<Version> {
        return (await axios.get<Version>(`/rest/versions/${id}`, { auth })).data
    }
    async updateVersion(id: string, data: VersionUpdateData, model?: File, image?: Blob): Promise<Version> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('model', model)
        body.append('image', image)
        return (await axios.put<Version>(`/rest/versions/${id}`, body, { auth })).data
    }
    async deleteVersion(id: string): Promise<Version> {
        return (await axios.delete<Version>(`/rest/versions/${id}`, { auth })).data
    }
}

export const VersionClient = new VersionClientImpl()