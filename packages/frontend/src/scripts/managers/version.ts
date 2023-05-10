import { Version, VersionAddData, VersionUpdateData } from 'productboard-common'

import { VersionClient } from '../clients/rest/version'
import { AbstractManager } from './abstract'

class VersionManagerImpl extends AbstractManager<Version> {
    // CACHE

    findVersionsFromCache(productId: string) { 
        return this.getFind(productId)
    }
    getVersionFromCache(versionId: string) { 
        return this.getItem(versionId)
    }

    // REST

    findVersions(productId: string, callback: (versions: Version[], error?: string) => void) {
        return this.find(
            productId,
            () => VersionClient.findVersions(productId),
            version => version.productId == productId,
            callback
        )
    }
    async addVersion(data: VersionAddData, files: {model: File, image: Blob}) {
        return this.resolveItem(await VersionClient.addVersion(data, files))
    }
    getVersion(id: string, callback: (version: Version, error?: string) => void) {
        return this.observeItem(id, () => VersionClient.getVersion(id), callback)
    }
    async updateVersion(id: string, data: VersionUpdateData, files?: {model: File, image: Blob}) {
        return this.promiseItem(id, VersionClient.updateVersion(id, data, files))
    }
    async deleteVersion(id: string) {
        return this.promiseItem(id, VersionClient.deleteVersion(id))
    }
}

export const VersionManager = new VersionManagerImpl()