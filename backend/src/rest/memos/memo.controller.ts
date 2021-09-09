import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBody,  ApiResponse } from '@nestjs/swagger'
import { CommentEventData, EventData, MemoREST } from 'fhooe-audit-platform-common'
import { MemoService } from './memo.service'

@Controller('rest/memos')
export class MemoController implements MemoREST {
    constructor(private memoService: MemoService) {
        
    }

    @Get()
    @ApiResponse({ type: [EventData] })
    async findAll(@Query('audit') audit: string, @Query('user') user?: string): Promise<EventData[]> {
        return this.memoService.findAll(audit, user)
    }


    @Post('enters')
    @ApiBody({ type: EventData })
    @ApiResponse({ type: EventData })
    async enterMemo(@Body() enterEvent: EventData): Promise<EventData> {
        return this.memoService.enterMemo(enterEvent)
    }

    @Post('leaves')
    @ApiBody({ type: EventData })
    @ApiResponse({ type: EventData })
    async leaveMemo(@Body() leaveEvent: EventData): Promise<EventData> {
        return this.memoService.leaveMemo(leaveEvent)
    }

    @Post('comments') 
    @ApiBody({ type: CommentEventData })
    @ApiResponse({ type: CommentEventData })
    async submitMemo(@Body() memo: CommentEventData): Promise<CommentEventData> {
        return this.memoService.submitMemo(memo)
    }
}