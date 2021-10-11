import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { CommentEvent, CommentEventData, EventData, EventREST } from 'fhooe-audit-platform-common'
import { EventService } from './event.service'

@Controller('rest/events')
export class EventController implements EventREST {
    constructor(private eventService: EventService) {
        
    }

    @Get()
    @ApiQuery({ name: 'quick' })
    @ApiQuery({ name: 'audit' })
    @ApiQuery({ name: 'type' })
    @ApiQuery({ name: 'product' })
    @ApiQuery({ name: 'version' })
    @ApiResponse({ type: [CommentEventData] })
    async findEvents(@Query('quick') quick?: string, @Query('audit') audit?: string,  @Query('type') type?: string, @Query('user') user?: string, @Query('product') product?: string, @Query('version') version?: string, @Query('comment') comment?: string): Promise<(EventData & {id: string})[]> {
        return this.eventService.findEvents(quick, audit, type, user, product, version, comment)
    }

    @Post('enters')
    @ApiBody({ type: EventData })
    @ApiResponse({ type: EventData })
    async enterEvent(@Body() enterEvent: EventData): Promise<EventData & {id: string}> {
        return this.eventService.enterEvent(enterEvent)
    }

    @Post('leaves')
    @ApiBody({ type: EventData })
    @ApiResponse({ type: EventData })
    async leaveEvent(@Body() leaveEvent: EventData): Promise<EventData & {id: string}> {
        return this.eventService.leaveEvent(leaveEvent)
    }

    @Post('comments') 
    @ApiBody({ type: CommentEventData })
    @ApiResponse({ type: CommentEventData })
    async submitEvent(@Body() submitEvent: CommentEventData): Promise<CommentEvent> {
        return this.eventService.submitEvent(submitEvent)
    }
}