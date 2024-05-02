import axios from 'axios'

import { VersionCreate, VersionREST, VersionRead, VersionUpdate } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class VersionClientImpl implements VersionREST<VersionCreate, VersionUpdate, File, Blob> {
    async findVersions(productId: string): Promise<VersionRead[]> {
        return (await axios.get<VersionRead[]>(`/rest/products/${productId}/versions`, auth)).data
    }
    async addVersion(productId: string, data: VersionCreate, files: {model: File, image: Blob}): Promise<VersionRead> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files.model) {
            body.append('model', files.model)
        }
        if (files.image) {
            body.append('image', files.image)
        }
        const version = (await axios.post<VersionRead>(`/rest/products/${productId}/versions`, body, auth)).data
        CacheAPI.putVersion(version)
        return version
    }
    async getVersion(productId: string, versionId: string): Promise<VersionRead> {
        return (await axios.get<VersionRead>(`/rest/products/${productId}/versions/${versionId}`, auth)).data
    }
    async updateVersion(productId: string, versionId: string, data: VersionUpdate, files?: {model: File, image: Blob}): Promise<VersionRead> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files) {
            if (files.model) {
                body.append('model', files.model)
            }
            if (files.image) {
                body.append('image', files.image)
            }
        }
        const version = (await axios.put<VersionRead>(`/rest/products/${productId}/versions/${versionId}`, body, auth)).data
        CacheAPI.putVersion(version)
        return version
    }
    async deleteVersion(productId: string, versionId: string): Promise<VersionRead> {
        const version = (await axios.delete<VersionRead>(`/rest/products/${productId}/versions/${versionId}`, auth)).data
        CacheAPI.putVersion(version)
        return version
    }
}

export const VersionClient = new VersionClientImpl()