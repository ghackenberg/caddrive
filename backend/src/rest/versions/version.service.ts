import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'
import { ProductService } from '../products/product.service'

@Injectable()
export class VersionService implements VersionREST {
    private versions: Version[] = [{name: 'Version 1', id: 'TestVersion', productId: 'TestProduct', date: new Date().toString()}]

    public constructor(private productService: ProductService) {

    }
 
    async addVersion(data: VersionData): Promise<Version> {
        const version = { id: shortid(), ...data }

        this.versions.push(version)
        
        return version
    }

    async deleteVersion(version: Version): Promise<Version[]> {

        this.versions = this.versions.filter(versions => versions.id != version.id);

        return this.versions
    }

    async findVersions(quick?: string, name?: string, product?: string) : Promise<Version[]> {
        const result: Version[] = []

        quick = quick ? quick.toLowerCase() : undefined
        name = name ? name.toLowerCase() : undefined

        for (var index = 0; index < this.versions.length; index++) {

            const version = this.versions[index]

            if (quick) {
                const conditionA = version.name.toLowerCase().includes(quick)
                const conditionB = (await this.productService.getProduct(version.productId)).name.toLowerCase().includes(quick)
                
                if (!(conditionA || conditionB)) {
                    continue
                }
            }
            if (name && !version.name.toLowerCase().includes(name)) {
                continue
            }
            if (product && version.productId != product) {
                continue
            }
            result.push(version)
        }

        return result
    }

    async getVersion(id: string): Promise<Version> {
        for (var i = 0; i < this.versions.length; i++) {
            if (this.versions[i].id == id)
                return this.versions[i]
        }
        return null
    }

    async updateVersion(version: Version): Promise<Version> {
        
        for (var i = 0; i < this.versions.length; i++) {
            if (this.versions[i].id == version.id && (
                    this.versions[i].name != version.name ||
                    this.versions[i].date != version.date)) {

                this.versions.splice(i,1,version)
            }
        }
        return version
    }
}