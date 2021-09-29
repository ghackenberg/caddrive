import { Injectable } from '@nestjs/common'
import { EventREST, CommentEventData, EventData } from 'fhooe-audit-platform-common'

@Injectable()
export class EventService implements EventREST {
    private readonly events: CommentEventData[] = [{time: new Date(), auditId: 'Test', user: 'Test', type: 'comment', text: 'Test'}]
 
    async findEvents(_audit?: string, _type?: string) {

        // TODO: add event search algorithm
        if (_audit && _type) {
            const auditEvents = this.events.filter(event => event.auditId == _audit)

            return auditEvents.filter(event => event.type == _type)
        }
        else {
            return this.events
        }
    }

    async enterEvent(enterEvent: EventData) {

        const event: CommentEventData = {time: enterEvent.time, auditId: enterEvent.auditId, user: enterEvent.user, type: enterEvent.type, text: undefined}

        this.events.push(event)

        return enterEvent
    }

    async leaveEvent(leaveEvent: EventData) {

        const event: CommentEventData = {time: leaveEvent.time, auditId: leaveEvent.auditId, user: leaveEvent.user, type: leaveEvent.type, text: undefined}

        this.events.push(event)

        return leaveEvent
    }

    async submitEvent(event: CommentEventData) {

        this.events.push(event)

        return event
    }

}