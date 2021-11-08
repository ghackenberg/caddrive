import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { Audit, AuditData, AuditREST } from 'fhooe-audit-platform-common'
import { VersionService } from '../versions/version.service'
import { ProductService } from '../products/product.service'
import { EventService } from '../events/event.service'

@Injectable()
export class AuditService implements AuditREST {
    private static readonly audits: Audit[] = [
        { id: 'demo', versionId: 'demo', name: 'Demo Audit', start: new Date().toString(), end: new Date().toString() }
    ]

    public constructor(
        @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,
        @Inject(forwardRef(() => VersionService))
        private readonly versionService: VersionService,
        @Inject(forwardRef(() => EventService))
        private readonly eventService: EventService
    ) {}

    async findAudits(quick?: string, name?: string, productId?: string, versionId?: string) : Promise<Audit[]> {
        const result: Audit[] = []

        quick = quick ? quick.toLowerCase() : undefined
        name = name ? name.toLowerCase() : undefined

        for (const audit of AuditService.audits) {
            const version = await this.versionService.getVersion(audit.versionId)
            const product = await this.productService.getProduct(version.productId)

            if (quick) {
                const conditionA = audit.name.toLowerCase().includes(quick)
                const conditionB = version.name.toLowerCase().includes(quick)
                const conditionC = product.name.toLowerCase().includes(quick)
                
                if (!(conditionA || conditionB || conditionC)) {
                    continue
                }
            }
            if (name && !audit.name.toLowerCase().includes(name)) {
                continue
            }
            if (productId && product.id != productId) {
                continue
            }
            if (versionId && version.id != versionId) {
                continue
            }

            result.push(audit)
        }

        return result
    }

    async addAudit(data: AuditData): Promise<Audit> {
        const audit = { id: shortid(), ...data }
        AuditService.audits.push(audit)
        return audit
    }

    async getAudit(id: string): Promise<Audit> {
        for (const audit of AuditService.audits) {
            if (audit.id == id) {
                return audit
            }
        }
        throw new NotFoundException()
    }

    async updateAudit(id: string, data: AuditData): Promise<Audit> {
        for (var index = 0; index < AuditService.audits.length; index++) {
            const audit = AuditService.audits[index]
            if (audit.id == id) {
                AuditService.audits.splice(index, 1, { id, ...data })
                return AuditService.audits[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteAudit(id: string): Promise<Audit> {
        for (var index = 0; index < AuditService.audits.length; index++) {
            const audit = AuditService.audits[index]
            if (audit.id == id) {
                for (const event of await this.eventService.findEvents(null, null, null, null, null, null, id)) {
                    await this.eventService.deleteEvent(event.id)
                }
                AuditService.audits.splice(index, 1)
                return audit
            }
        }
        throw new NotFoundException()
    }
}