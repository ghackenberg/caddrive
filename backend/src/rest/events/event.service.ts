import { Injectable } from '@nestjs/common'
import { EventREST, CommentEventData, EventData, CommentEvent } from 'fhooe-audit-platform-common'
import * as shortid from 'shortid'
import { AuditService } from '../audits/audit.service'
import { ProductService } from '../products/product.service'
import { VersionService } from '../versions/version.service'

@Injectable()
export class EventService implements EventREST {
    private readonly events: (EventData & {id: string})[] = []// [{time: new Date(), auditId: 'TestAudit', user: 'Test', type: 'comment', text: 'Test'}]

    public constructor (private auditService: AuditService, private versionService: VersionService, private productService: ProductService) {

    }
 
    async findEvents(quick?: string, audit?: string, type?: string, user?: string, product?: string, version?: string, comment?: string) {

        const result: (EventData & {id: string})[] = []

        quick = quick ? quick.toLowerCase() : undefined
        type = type ? type.toLowerCase() : undefined
        user = user ? user.toLowerCase() : undefined
        comment = comment ? comment.toLowerCase() : undefined
        
        for (var index = 0; index < this.events.length; index++) {
            const event = this.events[index]
            const auditVersionId = (await this.auditService.getAudit(event.auditId)).versionId
            const versionProductId = (await this.versionService.getVersion(auditVersionId)).productId

            if (quick) {
                const conditionA = (await this.auditService.getAudit(event.auditId)).name.toLowerCase().includes(quick)
                const conditionB = event.type.toLowerCase().includes(quick)
                const conditionC = event.user.toLowerCase().includes(quick)
                const conditionD = (await this.productService.getProduct(versionProductId)).name.toLowerCase().includes(quick)
                const conditionE = (await this.versionService.getVersion(auditVersionId)).name.toLowerCase().includes(quick) 
                const conditionF = event.type.toLowerCase() == 'comment' && (event as CommentEvent).text.toLowerCase().includes(quick)

                if (!(conditionA || conditionB || conditionC || conditionD || conditionE || conditionF)) {
                    continue
                }
            }
            if (audit && event.auditId != audit) {
                continue
            }
            if (type && !event.type.toLowerCase().includes(type)) {
                continue
            }
            if (user && event.user.toLowerCase().includes(user)) {
                continue
            }
            if (product && versionProductId != product) {
                continue
            }
            if (version && auditVersionId != version) {
                continue
            }
            if (comment && (event.type != 'comment' || !(event as CommentEvent).text.toLowerCase().includes(comment))) {
                continue
            }
            result.push(event)   
        }

        return result
    }

    async enterEvent(enterEvent: EventData) {

        const event: EventData & {id: string} = {id: shortid(), ...enterEvent}

        this.events.push(event)

        return event
    }

    async leaveEvent(leaveEvent: EventData) {

        const event: EventData & {id: string} = {id: shortid(), ...leaveEvent}

        this.events.push(event)

        return event
    }

    async submitEvent(eventData: CommentEventData) {

        const event: CommentEvent = {id: shortid(), ...eventData}

        this.events.push(event)

        return event
    }

}