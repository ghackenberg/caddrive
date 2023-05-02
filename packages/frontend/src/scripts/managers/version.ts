import { Version, VersionAddData, VersionUpdateData, VersionREST, VersionDownMQTT } from 'productboard-common'

import { VersionAPI } from '../clients/mqtt/version'
import { VersionClient } from '../clients/rest/version'
import { AbstractManager } from './abstract'

class VersionManagerImpl extends AbstractManager<Version> implements VersionREST<VersionAddData, VersionUpdateData, File, Blob>, VersionDownMQTT {
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}

    constructor() {
        super()
        VersionAPI.register(this)
    }

    // CACHE

    override clear() {
        super.clear()
        this.findIndex = {}
    }

    findVersionsFromCache(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.load(id))
        } else { 
            return undefined 
        } 
    }
    getVersionFromCache(versionId: string) { 
        return this.load(versionId)
    }

    private addToFindIndex(version: Version) {
        if (`${version.productId}` in this.findIndex) {
            this.findIndex[`${version.productId}`][version.id] = true
        }
    }
    private removeFromFindIndex(version: Version) { 
        for (const key of Object.keys(this.findIndex)) {
            if (version.id in this.findIndex[key]) {
                delete this.findIndex[key][version.id]
            }
        }
    }

    // MQTT

    create(version: Version): void {
        version = this.store(version)
        this.addToFindIndex(version)
    }
    update(version: Version): void {
        version = this.store(version)
        this.removeFromFindIndex(version)
        this.addToFindIndex(version)
    }
    delete(version: Version): void {
        version = this.store(version)
        this.removeFromFindIndex(version)
    }

    // REST

    async findVersions(productId: string): Promise<Version[]> {
        const key = `${productId}`
        if (!(key in this.findIndex)) {
            // Call backend
            let versions = await VersionClient.findVersions(productId)
            // Update version index
            versions = versions.map(version => this.store(version))
            // Init find index
            this.findIndex[productId] = {}
            // Update find index
            versions.forEach(version => this.addToFindIndex(version))
        }
        // Return versions
        return Object.keys(this.findIndex[productId]).map(id => this.load(id)).filter(version => !version.deleted)
    }
    
    async addVersion(data: VersionAddData, files: {model: File, image: Blob}): Promise<Version> {
        // Call backend
        let version = await VersionClient.addVersion(data, files)
        // Update version index
        version = this.store(version)
        // Update find index
        this.addToFindIndex(version)
        // Return version
        return this.load(version.id)
    }

    async getVersion(id: string): Promise<Version> {
        if (!this.has(id)) {
            // Call backend
            let version = await VersionClient.getVersion(id)
            // Update version index
            version = this.store(version)
            // Update find index
            this.addToFindIndex(version)
        }
        // Return version
        return this.load(id)
    }

    async updateVersion(id: string, data: VersionUpdateData, files?: {model: File, image: Blob}): Promise<Version> {
        // Call backend
        let version = await VersionClient.updateVersion(id, data, files)
        // Update version index
        version = this.store(version)
        // Update find index
        this.removeFromFindIndex(version)
        this.addToFindIndex(version)
        // Return version
        return this.load(id)
    }

    async deleteVersion(id: string): Promise<Version> {
        // Call backend
        let version = await VersionClient.deleteVersion(id)
        // Update version index
        version = this.store(version)
        // Update find index
        this.removeFromFindIndex(version)
        // Return version
        return this.load(id)
    }
}

export const VersionManager = new VersionManagerImpl()