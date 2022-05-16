import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { Issue, IssueAddData, IssueUpdateData, IssueREST } from 'productboard-common'
import { CommentService } from '../comments/comment.service'
import { InjectRepository } from '@nestjs/typeorm'
import { IssueEntity } from './issue.entity'
import { Repository } from 'typeorm'



@Injectable()
export class IssueService implements IssueREST {
    private static readonly issues: Issue[] = [
        { id: 'demo-1', userId: 'demo-1', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Design vehicle that can be used in summer and winter.', text: '**Description**\n\n* In winter, the vehicle has to deal with cold temperatures and icy roads.\n* In summer, the vehicle has to deal with warm temperatures, rain, and mud.\n\n**Validation**\n\nWe plan to conduct test drives under winter and summer conditions to validate the product design.', state: 'closed', deleted: false, assigneeIds: ['demo-4', 'demo-3', 'demo-2'], milestoneId: 'demo-1' },
        { id: 'demo-2', userId: 'demo-2', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Use different wheel profile in winter version.', text: 'Please change the wheel profile (see [body_115_instance_2](/products/demo-1/versions/demo-3/objects/body_115_instance_2)). We need a stronger profile to handle winter conditions properly.', state: 'closed', deleted: false ,assigneeIds: ['demo-4', 'demo-3'], milestoneId: 'demo-1' },
        { id: 'demo-3', userId: 'demo-3', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Use blue helmet for driver.', text: 'Please change the helmet color (see [technic_driver_helmet_p_SOLIDS_1_1](/products/demo-1/versions/demo-3/objects/technic_driver_helmet_p_SOLIDS_1_1)). We want a blue helmet because it fits better to our corporate design standards.', state: 'closed', deleted: false ,assigneeIds: ['demo-4', 'demo-3'], milestoneId: 'demo-1' },

        { id: 'demo-4', userId: 'demo-4', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Install car radio for music.', text: 'Please install a car radio, so the driver can listen to music and news.', state: 'closed', deleted: false ,assigneeIds: ['demo-1', 'demo-2'], milestoneId: 'demo-1' },
        { id: 'demo-5', userId: 'demo-4', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Provide a possibility to mount a roof.', text: 'Please provide a mount to give possibility to hang up a roof in rainy days', state: 'closed', deleted: false ,assigneeIds: ['demo-1'], milestoneId: 'demo-1' },
        { id: 'demo-6', userId: 'demo-1', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Install seat belt for driver.', text: 'Please install a seat belt for safety', state: 'closed', deleted: false ,assigneeIds: ['demo-2', 'demo-4'], milestoneId: 'demo-1' },
        { id: 'demo-7', userId: 'demo-2', productId: 'demo-1', time: new Date('2022-04-10').toISOString(), label: 'Add frontlight and backlight .', text: 'Please provide frontlights and backlights for driving in the dark', state: 'open', deleted: false ,assigneeIds: ['demo-1', 'demo-4', 'demo-3'], milestoneId: 'demo-1' },
    ]

    public constructor(
        @Inject(forwardRef(() => CommentService))
        private readonly commentService: CommentService,

        @InjectRepository(IssueEntity)
        private readonly issueRepository: Repository <IssueEntity>,
    ) {
        this.issueRepository.count().then(async count => {
            if (count == 0) {
                for (const _issue of IssueService.issues) {
                     //await this.issueRepository.save(issue)
                }
            }
        })
    }

    async findIssues(productId: string, milestoneId?: string, state?: string) : Promise<Issue[]> {
        const result: Issue[] = []
        var where
        if (milestoneId && state) { where = { deleted: false, productId: productId, milestoneId: milestoneId, state: state } }
        else if (milestoneId) { where = { deleted: false, productId: productId, milestoneId: milestoneId } }
        else if (state) { where = { deleted: false, productId: productId, state: state } }
        else { where = { deleted: false, productId: productId } }
        for (const issue of await this.issueRepository.find({ where })) {
            result.push( {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId } )
        }
        return result
    }
  
    async addIssue(data: IssueAddData): Promise<Issue> {
        // TODO check if user exists
        // TODO check if product exists
        // TODO check if milestone exists
        // TODO check if assignees exist
        const issue = await this.issueRepository.save({ id: shortid(), deleted: false, ...data })
        return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
    }

    async getIssue(id: string): Promise<Issue> {
        const issue = await this.issueRepository.findOne(id)
        if (issue) {
            return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
        }
        throw new NotFoundException()
    }

    async updateIssue(id: string, data: IssueUpdateData): Promise<Issue> {
        // TODO check if milestone exists
        // TODO check if assignees exist

        const issue = await this.issueRepository.findOne(id)
        if (issue) {
            issue.assigneeIds = data.assigneeIds
            issue.label = data.label
            issue.milestoneId =  data.milestoneId
            issue.state = data.state
            issue.text = data.text
            await this.issueRepository.save(issue)
            return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
        }
        throw new NotFoundException()
    }

    async deleteIssue(id: string): Promise<Issue> {

        const issue = await this.issueRepository.findOne(id)

        // Kommentare zu Issue löschen
        // später über db
        if (issue) {
            for (const issue of IssueService.issues) {
                if (issue.id == id) {
                    for (const comment of await this.commentService.findComments(id)) {
                        await this.commentService.deleteComment(comment.id)
                    }
                    //issue.deleted = true
                    //return issue
                }
            }

        // db
            issue.deleted = true
            await this.issueRepository.save(issue)
            return {id: issue.id, deleted: issue.deleted, userId: issue.userId, productId: issue.productId, time: issue.time, label: issue.label, text: issue.text, state: issue.state, assigneeIds: issue.assigneeIds, milestoneId: issue.milestoneId }
        }


        throw new NotFoundException()
    }
}