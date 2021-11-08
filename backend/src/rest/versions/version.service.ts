import 'multer'
import * as fs from 'fs'
import * as shortid from 'shortid'
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Version, VersionData, VersionREST } from 'fhooe-audit-platform-common'
import { ProductService } from '../products/product.service'
import { AuditService } from '../audits/audit.service'

@Injectable()
export class VersionService implements VersionREST<Express.Multer.File> {
    private static readonly versions: Version[] = [
        { id: 'demo', productId: 'demo', name: 'Demo Version', date: new Date().toISOString() }
    ]

    public constructor(
        @Inject(forwardRef(() => ProductService))
        private productService: ProductService,
        @Inject(forwardRef(() => AuditService))
        private auditService: AuditService
    ) {}

    async findVersions(quick?: string, name?: string, productId?: string) : Promise<Version[]> {
        const result: Version[] = []

        quick = quick ? quick.toLowerCase() : undefined
        name = name ? name.toLowerCase() : undefined

        for (const version of VersionService.versions) {
            const product = await this.productService.getProduct(version.productId)

            if (quick) {
                const conditionA = version.name.toLowerCase().includes(quick)
                const conditionB = product.name.toLowerCase().includes(quick)

                if (!(conditionA || conditionB)) {
                    continue
                }
            }
            if (name && !version.name.toLowerCase().includes(name)) {
                continue
            }
            if (productId && product.id != productId) {
                continue
            }
            result.push(version)
        }

        return result
    }
 
    async addVersion(data: VersionData, file: Express.Multer.File): Promise<Version> {
        const version = { id: shortid(), ...data }
        if (file && file.originalname.endsWith('.glb')) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            fs.writeFileSync(`./uploads/${version.id}.glb`, file.buffer)
        }
        VersionService.versions.push(version)
        return version
    }

    async getVersion(id: string): Promise<Version> {
        for (const version of VersionService.versions) {
            if (version.id == id) {
                return version
            }
        }
        throw new NotFoundException()
    }

    async updateVersion(id: string, data: VersionData, _file?: Express.Multer.File): Promise<Version> {
        for (var index = 0; index < VersionService.versions.length; index++) {
            const version = VersionService.versions[index]
            if (version.id == id) {
                VersionService.versions.splice(index, 1, { id, ...data })
                return VersionService.versions[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteVersion(id: string): Promise<Version> {
        for (var index = 0; index < VersionService.versions.length; index++) {
            const version = VersionService.versions[index]
            if (version.id == id) {
                for (const audit of await this.auditService.findAudits(null, null, null, id)) {
                    await this.auditService.deleteAudit(audit.id)
                }
                VersionService.versions.splice(index, 1)
                return version
            }
        }
        throw new NotFoundException()
    }
}