import { Version, VersionData, VersionREST } from 'productboard-common'
import { VersionClient } from '../clients/rest/version'

class VersionManagerImpl implements VersionREST<VersionData, File> {
    private versionIndex: {[id: string]: Version} = {}
    private productIndex: {[id: string]: {[id: string]: boolean}} = {}

    async findVersions(productId: string): Promise<Version[]> {
        if (!(productId in this.productIndex)) {
            // Contact backend
            const versions = await VersionClient.findVersions(productId)
            // Update version index
            for (const version of versions) {
                this.versionIndex[version.id] = version
            }
            // Update product index
            this.productIndex[productId] = {}
            for (const version of versions) {
                this.productIndex[productId][version.id] = true
            }
        }
        // Return versions
        return Object.keys(this.productIndex[productId]).map(id => this.versionIndex[id])
    }

    async addVersion(data: VersionData, file: File): Promise<Version> {
        // Call backend
        const version = await VersionClient.addVersion(data, file)
        // Update version index
        this.versionIndex[version.id] = version
        // Update product index
        if (version.productId in this.productIndex) {
            this.productIndex[version.productId][version.id] = true
        }
        // Return version
        return version
    }

    async getVersion(id: string): Promise<Version> {
        if (!(id in this.versionIndex)) {
            // Call backend
            const version = await VersionClient.getVersion(id)
            // Update version index
            this.versionIndex[id] = version
            // Update product index
            if (version.productId in this.productIndex) {
                this.productIndex[version.productId][id] = true
            }
        }
        // Return version
        return this.versionIndex[id]
    }

    async updateVersion(id: string, data: VersionData, file?: File): Promise<Version> {
        // Update product index
        if (id in this.versionIndex) {
            const version = this.versionIndex[id]
            // Update product index
            if (version.productId in this.productIndex) {
                delete this.productIndex[version.productId][id]
            }
        }
        // Call backend
        const version = await VersionClient.updateVersion(id, data, file)
        // Update version index
        this.versionIndex[id] = version
        // Update product index
        if (version.productId in this.productIndex) {
            this.productIndex[version.productId][id] = true
        }
        // Return version
        return version
    }

    async deleteVersion(id: string): Promise<Version> {
        // Call backend
        const version = await VersionClient.deleteVersion(id)
        // Update version index
        this.versionIndex[id] = version
        // Update product index
        if (version.productId in this.productIndex) {
            delete this.productIndex[version.productId][id]
        }
        // Return version
        return version
    }
}

export const VersionManager = new VersionManagerImpl()