import { Injectable } from '@nestjs/common'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { TagAssignment, TagAssignmentAddData, TagAssignmentREST, TagAssignmentUpdateData } from "productboard-common"
import { Database, TagAssignmentEntity } from 'productboard-database'

import { convertTagAssignment } from '../../../functions/convert'

@Injectable()
export class TagAssignmentService implements TagAssignmentREST {
 
    async findTagAssignments(issueId: string) : Promise<TagAssignment[]> {
        let where: FindOptionsWhere<TagAssignmentEntity>
        if (issueId)
            where = { issueId, deleted: IsNull() }
        const result: TagAssignment[] = []
        for (const tagAssignment of await Database.get().tagAssignmentRepository.findBy(where))
            result.push(convertTagAssignment(tagAssignment))
        return result
    }

    async addTagAssignment(data: TagAssignmentAddData): Promise<TagAssignment> {
        const id = shortid()
        const created = Date.now()
        const tagAssignment = await Database.get().tagAssignmentRepository.save({id: id, created: created, ...data})
        return convertTagAssignment(tagAssignment)
    }
    async getTagAssignment(id: string): Promise<TagAssignment> {
        const tagAssignment = await Database.get().tagAssignmentRepository.findOneByOrFail({ id })
        return convertTagAssignment(tagAssignment)
    }
    async updateTagAssignment(id: string, data: TagAssignmentUpdateData): Promise<TagAssignment> {
        const tagAssignment = await Database.get().tagAssignmentRepository.findOneByOrFail({ id })
        tagAssignment.updated = Date.now()
        tagAssignment.issueId = data.issueId
        tagAssignment.tagId = data.tagId
        await Database.get().tagAssignmentRepository.save(tagAssignment)
        return convertTagAssignment(tagAssignment)
    }
    async deleteTagAssignment(id: string): Promise<TagAssignment> {
        const tagAssignment = await Database.get().tagAssignmentRepository.findOneByOrFail({ id })
        tagAssignment.deleted = Date.now()
        await Database.get().tagAssignmentRepository.save(tagAssignment)
        return convertTagAssignment(tagAssignment)
    } 
}
