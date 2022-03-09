import axios from 'axios'
// Commons
import { Version, VersionData, VersionREST } from 'productboard-common'
// Globals
import { auth } from '../auth'

class VersionClient implements VersionREST<VersionData, File> {
    async findVersions(product: string): Promise<Version[]> {
        return (await axios.get<Version[]>('/rest/versions', { params: { product }, auth } )).data
    }
    async addVersion(data: VersionData, file: File): Promise<Version> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        return (await axios.post<Version>('/rest/versions', body, { auth })).data
    }
    async getVersion(id: string): Promise<Version> {
        return (await axios.get<Version>(`/rest/versions/${id}`, { auth })).data
    }
    async updateVersion(id: string, data: VersionData, file?: File): Promise<Version> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        return (await axios.put<Version>(`/rest/versions/${id}`, body, { auth })).data
    }
    async deleteVersion(id: string): Promise<Version> {
        return (await axios.delete<Version>(`/rest/versions/${id}`, { auth })).data
    }
}

export const VersionAPI = new VersionClient()