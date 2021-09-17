import { Injectable } from '@nestjs/common'
import { EventREST, CommentEventData, EventData } from 'fhooe-audit-platform-common'

@Injectable()
export class EventService implements EventREST {
    private readonly events: CommentEventData[] = [{time: new Date(), audit: 'Test', user: 'Test', type: 'comment', text: 'Test'}]
 
    async findComments(_audit: string, _user?: string) {
        return this.events
    }

    async enterEvent(enterEvent: EventData) {
        return enterEvent
    }

    async leaveEvent(leaveEvent: EventData) {
        return leaveEvent
    }

    async submitEvent(event: CommentEventData) {

        if (event) {
            this.events.push(event)
        }

        return event
    }

}