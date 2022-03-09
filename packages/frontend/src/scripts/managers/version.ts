import { Version, VersionData, VersionREST } from 'productboard-common'
import { VersionClient } from '../clients/rest/version'

class VersionManagerImpl implements VersionREST<VersionData, File> {
    async findVersions(productId: string): Promise<Version[]> {
        return VersionClient.findVersions(productId)
    }
    async addVersion(data: VersionData, file: File): Promise<Version> {
        return VersionClient.addVersion(data, file)
    }
    async getVersion(id: string): Promise<Version> {
        return VersionClient.getVersion(id)
    }
    async updateVersion(id: string, data: VersionData, file?: File): Promise<Version> {
        return VersionClient.updateVersion(id, data, file)
    }
    async deleteVersion(id: string): Promise<Version> {
        return VersionClient.deleteVersion(id)
    }
}

export const VersionManager = new VersionManagerImpl()