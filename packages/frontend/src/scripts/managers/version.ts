import { Version, VersionAddData, VersionUpdateData, VersionREST } from 'productboard-common'

import { VersionClient } from '../clients/rest/version'

class VersionManagerImpl implements VersionREST<VersionAddData, VersionUpdateData, File, Blob> {
    private versionIndex: {[id: string]: Version} = {}
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}

    getVersionCount(productId: string) { 
        if (productId in this.findIndex) { 
            return Object.keys(this.findIndex[productId]).length 
        } else { 
            return undefined 
        } 
    }

    findVersionsFromCache(productId: string) { 
        if (productId in this.findIndex) { 
            return Object.keys(this.findIndex[productId]).map(id => this.versionIndex[id])
        } else { 
            return undefined 
        } 
    }

    async findVersions(productId: string): Promise<Version[]> {
        if (!(productId in this.findIndex)) {
            // Contact backend
            const versions = await VersionClient.findVersions(productId)
            // Update version index
            for (const version of versions) {
                this.versionIndex[version.id] = version
            }
            // Update product index
            this.findIndex[productId] = {}
            for (const version of versions) {
                this.findIndex[productId][version.id] = true
            }
        }
        // Return versions
        return Object.keys(this.findIndex[productId]).map(id => this.versionIndex[id])
    }
    
    async addVersion(data: VersionAddData, files: {model: File, image: Blob}): Promise<Version> {
        // Call backend
        const version = await VersionClient.addVersion(data, files)
        // Update version index
        this.versionIndex[version.id] = version
        // Update product index
        if (version.productId in this.findIndex) {
            this.findIndex[version.productId][version.id] = true
        }
        // Return version
        return version
    }

    getVersionFromCache(versionId: string) { 
        if (versionId in this.versionIndex) { 
            return this.versionIndex[versionId]
        } else { 
            return undefined 
        } 
    }

    async getVersion(id: string): Promise<Version> {
        if (!(id in this.versionIndex)) {
            // Call backend
            const version = await VersionClient.getVersion(id)
            // Update version index
            this.versionIndex[id] = version
            // Update product index
            if (version.productId in this.findIndex) {
                this.findIndex[version.productId][id] = true
            }
        }
        // Return version
        return this.versionIndex[id]
    }

    async updateVersion(id: string, data: VersionUpdateData, files?: {model: File, image: Blob}): Promise<Version> {
        // Update product index
        if (id in this.versionIndex) {
            const version = this.versionIndex[id]
            // Update product index
            if (version.productId in this.findIndex) {
                delete this.findIndex[version.productId][id]
            }
        }
        // Call backend
        const version = await VersionClient.updateVersion(id, data, files)
        // Update version index
        this.versionIndex[id] = version
        // Update product index
        if (version.productId in this.findIndex) {
            this.findIndex[version.productId][id] = true
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
        if (version.productId in this.findIndex) {
            delete this.findIndex[version.productId][id]
        }
        // Return version
        return version
    }
}

export const VersionManager = new VersionManagerImpl()