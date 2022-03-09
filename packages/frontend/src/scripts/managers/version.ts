import { Version, VersionData, VersionREST } from 'productboard-common'
import { VersionAPI } from '../clients/rest/version'

class VersionManagerImpl implements VersionREST<VersionData, File> {
    async findVersions(productId: string): Promise<Version[]> {
        return VersionAPI.findVersions(productId)
    }
    async addVersion(data: VersionData, file: File): Promise<Version> {
        return VersionAPI.addVersion(data, file)
    }
    async getVersion(id: string): Promise<Version> {
        return VersionAPI.getVersion(id)
    }
    async updateVersion(id: string, data: VersionData, file?: File): Promise<Version> {
        return VersionAPI.updateVersion(id, data, file)
    }
    async deleteVersion(id: string): Promise<Version> {
        return VersionAPI.deleteVersion(id)
    }
}

export const VersionManager = new VersionManagerImpl()