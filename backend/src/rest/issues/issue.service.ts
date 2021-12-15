import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { Issue, IssueData, IssueREST } from 'productboard-common'
import { CommentService } from '../comments/comment.service'

@Injectable()
export class IssueService implements IssueREST {
    private static readonly issues: Issue[] = [
        { id: 'demo-1', userId: 'demo', productId: 'demo-1', time: new Date().toString(), label: 'Demo Issue 1', text: 'This issue demonstrates the capabilities of [ProductBoard](./).', state: 'closed' },
        { id: 'demo-2', userId: 'demo', productId: 'demo-1', time: new Date().toString(), label: 'Demo Issue 2', text: 'This issue demonstrates the capabilities of ProductBoard.', state: 'open' },
        { id: 'demo-3', userId: 'demo', productId: 'demo-1', time: new Date().toString(), label: 'Demo Issue 3', text: 'This issue demonstrates the capabilities of ProductBoard.', state: 'open' }
    ]

    public constructor(
        private readonly commentService: CommentService
    ) {}

    async findIssues(productId: string) : Promise<Issue[]> {
        const result: Issue[] = []

        for (const issue of IssueService.issues) {
            if (issue.productId != productId) {
                continue
            }
            result.push(issue)
        }

        return result
    }

    async addIssue(data: IssueData): Promise<Issue> {
        const issue = { id: shortid(), ...data }
        IssueService.issues.push(issue)
        return issue
    }

    async getIssue(id: string): Promise<Issue> {
        for (const issue of IssueService.issues) {
            if (issue.id == id) {
                return issue
            }
        }
        throw new NotFoundException()
    }

    async updateIssue(id: string, data: IssueData): Promise<Issue> {
        for (var index = 0; index < IssueService.issues.length; index++) {
            const issue = IssueService.issues[index]
            if (issue.id == id) {
                IssueService.issues.splice(index, 1, { id, ...data })
                return IssueService.issues[index]
            }
        }
        throw new NotFoundException()
    }

    async deleteIssue(id: string): Promise<Issue> {
        for (var index = 0; index < IssueService.issues.length; index++) {
            const issue = IssueService.issues[index]
            if (issue.id == id) {
                for (const comment of await this.commentService.findComments(id)) {
                    await this.commentService.deleteComment(comment.id)
                }
                IssueService.issues.splice(index, 1)
                return issue
            }
        }
        throw new NotFoundException()
    }
}