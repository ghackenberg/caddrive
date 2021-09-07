import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBody,  ApiResponse } from '@nestjs/swagger'
import { CommentEventData, EventData, MemoREST } from 'fhooe-audit-platform-common'
import { MemoService } from './memo.service'

@Controller('rest/memos')
export class MemoController implements MemoREST {
    constructor(private memoService: MemoService) {
        
    }

    @Get()
    @ApiResponse({ type: [CommentEventData] })
    async findAll(): Promise<CommentEventData[]> {
        return this.memoService.findAll()
    }


    @Post()
    @ApiBody({ type: EventData })
    @ApiResponse({ type: EventData })
    async enterMemo(@Body() enterEvent: EventData): Promise<EventData> {
        return this.memoService.enterMemo(enterEvent)
    }

    @Post()
    @ApiBody({ type: EventData })
    @ApiResponse({ type: EventData })
    async leaveMemo(@Body() leaveEvent: EventData): Promise<EventData> {
        return this.memoService.leaveMemo(leaveEvent)
    }

    @Post() 
    @ApiBody({ type: CommentEventData })
    @ApiResponse({ type: CommentEventData })
    async submitMemo(@Body() memo: CommentEventData): Promise<CommentEventData> {
        return this.memoService.submitMemo(memo)
    }
}