import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { EventREST, CommentEventData, CommentEvent, Event, EnterEventData, EnterEvent, LeaveEventData, LeaveEvent } from 'fhooe-audit-platform-common'
import * as shortid from 'shortid'
import { AuditService } from '../audits/audit.service'
import { ProductService } from '../products/product.service'
import { UserService } from '../users/user.service'
import { VersionService } from '../versions/version.service'

@Injectable()
export class EventService implements EventREST {
    private static readonly events: Event[] = []

    public constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        @Inject(forwardRef(() => ProductService))
        private productService: ProductService,
        @Inject(forwardRef(() => VersionService))
        private versionService: VersionService,
        @Inject(forwardRef(() => AuditService))
        private auditService: AuditService
    ) {}
 
    async findEvents(quick?: string, type?: string, comment?: string, userId?: string, productId?: string, versionId?: string, auditId?: string): Promise<Event[]> {
        const result: Event[] = []

        quick = quick ? quick.toLowerCase() : undefined
        type = type ? type.toLowerCase() : undefined
        comment = comment ? comment.toLowerCase() : undefined
        
        for (const event of EventService.events) {
            const audit = await this.auditService.getAudit(event.auditId)
            const version = await this.versionService.getVersion(audit.versionId)
            const product = await this.productService.getProduct(version.productId)
            const user = await this.userService.getUser(event.userId)

            if (quick) {
                const conditionA = audit.name.toLowerCase().includes(quick)
                const conditionB = version.name.toLowerCase().includes(quick)
                const conditionC = product.name.toLowerCase().includes(quick)
                const conditionD = user.name.toLowerCase().includes(quick)
                const conditionE = event.type.toLowerCase().includes(quick)
                const conditionF = event.type == 'comment' && (event as CommentEvent).text.toLowerCase().includes(quick)

                if (!(conditionA || conditionB || conditionC || conditionD || conditionE || conditionF)) {
                    continue
                }
            }
            if (type && !event.type.toLowerCase().includes(type)) {
                continue
            }
            if (comment && (event.type != 'comment' || !(event as CommentEvent).text.toLowerCase().includes(comment))) {
                continue
            }
            if (userId && user.id != userId) {
                continue
            }
            if (productId && product.id != productId) {
                continue
            }
            if (versionId && version.id != versionId) {
                continue
            }
            if (auditId && audit.id != auditId) {
                continue
            }

            result.push(event)   
        }

        return result
    }

    async addEnterEvent(data: EnterEventData): Promise<EnterEvent> {
        const event = { id: shortid(), ...data }
        EventService.events.push(event)
        return event
    }

    async addLeaveEvent(data: LeaveEventData): Promise<LeaveEvent> {
        const event = { id: shortid(), ...data }
        EventService.events.push(event)
        return event
    }

    async addCommentEvent(data: CommentEventData): Promise<CommentEvent> {
        const event = { id: shortid(), ...data }
        EventService.events.push(event)
        return event
    }

    async deleteEvent(id: string): Promise<Event> {
        for (var index = 0; index < EventService.events.length; index++) {
            const event = EventService.events[index]
            if (event.id == id) {
                EventService.events.splice(index, 1)
                return event
            }
        }
        throw new NotFoundException()
    }
}