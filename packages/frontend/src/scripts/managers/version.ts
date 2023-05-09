import { Version, VersionAddData, VersionUpdateData, VersionREST } from 'productboard-common'

import { VersionClient } from '../clients/rest/version'
import { AbstractManager } from './abstract'

class VersionManagerImpl extends AbstractManager<Version> implements VersionREST<VersionAddData, VersionUpdateData, File, Blob> {
    // CACHE

    findVersionsFromCache(productId: string) { 
        return this.getFind(productId)
    }
    getVersionFromCache(versionId: string) { 
        return this.getItem(versionId)
    }

    // REST

    async findVersions(productId: string) {
        return this.find(
            productId,
            () => VersionClient.findVersions(productId),
            version => version.productId == productId
        )
    }
    async addVersion(data: VersionAddData, files: {model: File, image: Blob}) {
        return this.add(VersionClient.addVersion(data, files))
    }
    async getVersion(id: string) {
        return this.get(id, () => VersionClient.getVersion(id))
    }
    async updateVersion(id: string, data: VersionUpdateData, files?: {model: File, image: Blob}) {
        return this.update(id, VersionClient.updateVersion(id, data, files))
    }
    async deleteVersion(id: string) {
        return this.delete(id, VersionClient.deleteVersion(id))
    }
}

export const VersionManager = new VersionManagerImpl()