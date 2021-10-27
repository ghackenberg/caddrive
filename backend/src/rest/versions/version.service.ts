import 'multer'
import * as fs from 'fs'
import * as shortid from 'shortid'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'
import { ProductService } from '../products/product.service'
import { AuditService } from '../audits/audit.service'

@Injectable()
export class VersionService implements VersionREST<Express.Multer.File> {
    private versions: Version[] = [{name: 'Version 1', id: 'TestVersion', productId: 'TestProduct', date: new Date().toISOString()}]

    public constructor(
        @Inject(forwardRef(() => ProductService))
        private productService: ProductService,
        @Inject(forwardRef(() => AuditService))
        private auditService: AuditService
    ) {}
 
    async addVersion(data: VersionData, file: Express.Multer.File): Promise<Version> {
        const version = { id: shortid(), ...data }

        if (file && file.originalname.endsWith('.glb')) {
            console.log(file)

            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }

            fs.writeFileSync(`./uploads/${version.id}.glb`, file.buffer)
        }

        /*
        var FileSaver = require('file-saver')

        console.log(file)

        FileSaver.saveAs(file, file.originalname)
        */

        this.versions.push(version)
        
        return version
    }

    async deleteVersion(id: string, productId?: string): Promise<Version[]> {

        if (id) {
            this.versions = this.versions.filter(versions => versions.id != id)
            this.auditService.deleteAudit(undefined, id)
        }

        if (productId) {
            const version = this.versions.find(version => version.productId == productId)
            this.auditService.deleteAudit(undefined, version.id)
            this.versions = this.versions.filter(versions => versions.productId != productId)
        }

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

    async updateVersion(version: Version, _file?: Express.Multer.File): Promise<Version> {
        
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