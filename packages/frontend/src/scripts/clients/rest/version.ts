import axios from 'axios'

import { Version, VersionAddData, VersionUpdateData, VersionREST } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class VersionClientImpl implements VersionREST<VersionAddData, VersionUpdateData, File, Blob> {
    async findVersions(productId: string): Promise<Version[]> {
        return (await axios.get<Version[]>(`/rest/products/${productId}/versions`, auth)).data
    }
    async addVersion(productId: string, data: VersionAddData, files: {model: File, image: Blob}): Promise<Version> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files.model) {
            body.append('model', files.model)
        }
        if (files.image) {
            body.append('image', files.image)
        }
        const version = (await axios.post<Version>(`/rest/products/${productId}/versions`, body, auth)).data
        CacheAPI.putVersion(version)
        return version
    }
    async getVersion(productId: string, versionId: string): Promise<Version> {
        return (await axios.get<Version>(`/rest/products/${productId}/versions/${versionId}`, auth)).data
    }
    async updateVersion(productId: string, versionId: string, data: VersionUpdateData, files?: {model: File, image: Blob}): Promise<Version> {
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
        const version = (await axios.put<Version>(`/rest/products/${productId}/versions/${versionId}`, body, auth)).data
        CacheAPI.putVersion(version)
        return version
    }
    async deleteVersion(productId: string, versionId: string): Promise<Version> {
        const version = (await axios.delete<Version>(`/rest/products/${productId}/versions/${versionId}`, auth)).data
        CacheAPI.putVersion(version)
        return version
    }
}

export const VersionClient = new VersionClientImpl()