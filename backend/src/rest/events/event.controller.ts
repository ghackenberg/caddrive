import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { CommentEvent, CommentEventData, EnterEvent, EnterEventData, Event, EventREST, LeaveEvent, LeaveEventData } from 'fhooe-audit-platform-common'
import { EventService } from './event.service'

@Controller('rest/events')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class EventController implements EventREST {
    constructor(
        private readonly eventService: EventService
    ) {}

    @Get()
    @ApiQuery({ name: 'quick', type: 'string', required: false })
    @ApiQuery({ name: 'type', type: 'string', required: false })
    @ApiQuery({ name: 'comment', type: 'string', required: false })
    @ApiQuery({ name: 'user', type: 'string', required: false })
    @ApiQuery({ name: 'product', type: 'string', required: false })
    @ApiQuery({ name: 'version', type: 'string', required: false })
    @ApiQuery({ name: 'audit', type: 'string', required: false })
    @ApiResponse({ type: [Event] })
    async findEvents(
        @Query('quick') quick?: string,
        @Query('type') type?: string,
        @Query('comment') comment?: string,
        @Query('user') userId?: string,
        @Query('product') productId?: string,
        @Query('version') versionId?: string,
        @Query('audit') auditId?: string
    ): Promise<Event[]> {
        return this.eventService.findEvents(quick, type, comment, userId, productId, versionId, auditId)
    }

    @Post('enters')
    @ApiBody({ type: EnterEventData, required: true })
    @ApiResponse({ type: EnterEvent })
    async addEnterEvent(
        @Body() data: EnterEventData
    ): Promise<EnterEvent> {
        return this.eventService.addEnterEvent(data)
    }

    @Post('leaves')
    @ApiBody({ type: LeaveEventData, required: true })
    @ApiResponse({ type: LeaveEvent })
    async addLeaveEvent(
        @Body() data: LeaveEventData
    ): Promise<LeaveEvent> {
        return this.eventService.addLeaveEvent(data)
    }

    @Post('comments')
    @ApiBody({ type: CommentEventData })
    @ApiResponse({ type: CommentEvent })
    async addCommentEvent(
        @Body() data: CommentEventData
    ): Promise<CommentEvent> {
        return this.eventService.addCommentEvent(data)
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true})
    @ApiResponse({ type: Event })
    async getEvent(
        @Param('id') id: string
    ): Promise<Event> {
        return this.eventService.getEvent(id)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Event })
    async deleteEvent(
        @Param('id') id: string 
    ): Promise<Event> {
        return this.eventService.deleteEvent(id)
    }
}