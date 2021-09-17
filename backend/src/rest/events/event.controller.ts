import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBody,  ApiResponse } from '@nestjs/swagger'
import { CommentEventData, EventData, EventREST } from 'fhooe-audit-platform-common'
import { EventService } from './event.service'

@Controller('rest/events')
export class EventController implements EventREST {
    constructor(private eventService: EventService) {
        
    }

    @Get()
    @ApiResponse({ type: [CommentEventData] })
    async findComments(@Query('audit') audit: string, @Query('user') user?: string): Promise<CommentEventData[]> {
        return this.eventService.findComments(audit, user)
    }

    @Post('enters')
    @ApiBody({ type: EventData })
    @ApiResponse({ type: EventData })
    async enterEvent(@Body() enterEvent: EventData): Promise<EventData> {
        return this.eventService.enterEvent(enterEvent)
    }

    @Post('leaves')
    @ApiBody({ type: EventData })
    @ApiResponse({ type: EventData })
    async leaveEvent(@Body() leaveEvent: EventData): Promise<EventData> {
        return this.eventService.leaveEvent(leaveEvent)
    }

    @Post('comments') 
    @ApiBody({ type: CommentEventData })
    @ApiResponse({ type: CommentEventData })
    async submitEvent(@Body() submitEvent: CommentEventData): Promise<CommentEventData> {
        return this.eventService.submitEvent(submitEvent)
    }
}