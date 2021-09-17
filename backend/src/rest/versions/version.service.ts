import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'

@Injectable()
export class VersionService implements VersionREST {
    private readonly versions: Version[] = []

    /*
    constructor() {
         
        var date = new Date()

        for (var i = 0; i < Math.random() * 20; i++) {
            this.versions.push({
                id: shortid(),
                name : shortid(),
                date : date.getUTCFullYear() + '-' + date.getMonth() + '-' + date.getDate()
            })
        }
        
    }
    */

    async findVersions(name?: string, product?: string) : Promise<Version[]> {
        
        if (name != null) {
            const versionsQuery: Version[] = []

            const versionsNameLower = this.versions.map(version => version.name.toLowerCase())
    
            for (var i = 0; i < versionsNameLower.length; i++) {
    
                if (!name || versionsNameLower[i].includes(name.toLowerCase())) {
                    versionsQuery.push(this.versions[i])
                }
            }
    
            return versionsQuery
        }
        else if (product && name == null) {
            return this.versions.filter(version => version.product == product)
        }
        else {
            return this.versions
        }

    }

    async getVersion(id: string): Promise<Version> {
        for (var i = 0; i < this.versions.length; i++) {
            if (this.versions[i].id == id)
                return this.versions[i]
        }
        return null
    }

    async addVersion(data: VersionData) {
        const version = { id: shortid(), ...data }

        this.versions.push(version)
        
        return version
    }
}