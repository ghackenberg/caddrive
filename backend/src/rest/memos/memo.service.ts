import { Injectable } from '@nestjs/common'
import { MemoREST, CommentEventData, EventData } from 'fhooe-audit-platform-common'

@Injectable()
export class MemoService implements MemoREST {
    private readonly memos: CommentEventData[] = [{time: new Date(), audit: 'Test', user: 'Test', type: 'comment', text: 'Test'}]

    /*
    constructor() {
        /*
        var date = new Date()

        for (var i = 0; i < Math.random() * 20; i++) {
            this.audits.push({
                id: shortid(),
                name: shortid(),
                start: date.getUTCFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
                end: date.getUTCFullYear() + '-' + (date.getMonth() + randomInteger(1,6)) + '-' + randomInteger(1,30),
                version:
            })
        }

        function randomInteger(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
    */
    

    async findAll(_audit: string, _user?: string) {
        return this.memos
    }

    async enterMemo(enterEvent: EventData) {
        return enterEvent
    }

    async leaveMemo(leaveEvent: EventData) {
        return leaveEvent
    }

    async submitMemo(memo: CommentEventData) {

        if (memo) {
            this.memos.push(memo)
        }

        return memo
    }

}