import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { TagAssignment, TagAssignmentAddData, TagAssignmentREST, TagAssignmentUpdateData } from "productboard-common"
import { Database, TagAssignmentEntity } from 'productboard-database'

@Injectable()
export class TagAssignmentService implements TagAssignmentREST {
    constructor(
        @Inject('MQTT')
        private readonly client: ClientProxy
    ) {

    }
 
    async findTagAssignments(issueId: string) : Promise<TagAssignment[]> {
        let where: FindOptionsWhere<TagAssignmentEntity>
        if (issueId)
            where = { issueId, deleted: null }
        const result: TagAssignment[] = []
        for (const tagAssignment of await Database.get().tagAssignmentRepository.findBy(where))
            result.push(this.convert(tagAssignment))
        return result
    }

    async addTagAssignment(data: TagAssignmentAddData): Promise<TagAssignment> {
        const id = shortid()
        const created = Date.now()
        const tagAssignment = await Database.get().tagAssignmentRepository.save({id: id, created: created, ...data})
        await this.client.emit(`/api/v1/tagAssignments/${tagAssignment.id}/create`, this.convert(tagAssignment))
        return this.convert(tagAssignment)
    }
    async getTagAssignment(id: string): Promise<TagAssignment> {
        const tagAssignment = await Database.get().tagAssignmentRepository.findOneByOrFail({ id })
        return this.convert(tagAssignment)
    }
    async updateTagAssignment(id: string, data: TagAssignmentUpdateData): Promise<TagAssignment> {
        const tagAssignment = await Database.get().tagAssignmentRepository.findOneByOrFail({ id })
        tagAssignment.updated = Date.now()
        tagAssignment.issueId = data.issueId
        tagAssignment.tagId = data.tagId
        await Database.get().tagAssignmentRepository.save(tagAssignment)
        await this.client.emit(`/api/v1/tagAssignments/${tagAssignment.id}/update`, this.convert(tagAssignment))
        return this.convert(tagAssignment)
    }
    async deleteTagAssignment(id: string): Promise<TagAssignment> {
        const tagAssignment = await Database.get().tagAssignmentRepository.findOneByOrFail({ id })
        tagAssignment.deleted = Date.now()
        await Database.get().tagAssignmentRepository.save(tagAssignment)
        await this.client.emit(`/api/v1/tagAssignments/${tagAssignment.id}/delete`, this.convert(tagAssignment))
        return this.convert(tagAssignment)
    } 

    private convert(tagAssignment: TagAssignmentEntity) {
        return { id: tagAssignment.id, issueId: tagAssignment.issueId, tagId: tagAssignment.tagId, created: tagAssignment.created, updated: tagAssignment.updated, deleted: tagAssignment.deleted }
    }
}