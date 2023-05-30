import { Injectable } from '@nestjs/common'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Tag, TagAddData, TagREST, TagUpdateData } from "productboard-common"
import { Database, TagEntity } from 'productboard-database'

import { convertTag } from '../../../functions/convert'

@Injectable()
export class TagService implements TagREST {
 
    async findTags(productId: string) : Promise<Tag[]> {
        let where: FindOptionsWhere<TagEntity>
        if (productId)
            where = { productId, deleted: IsNull() }
        const result: Tag[] = []
        for (const tag of await Database.get().tagRepository.findBy(where))
            result.push(convertTag(tag))
        return result
    }

    async addTag(data: TagAddData): Promise<Tag> {
        const id = shortid()
        const created = Date.now()
        const tag = await Database.get().tagRepository.save({id: id, created: created, ...data})
        return convertTag(tag)
    }
    async getTag(id: string): Promise<Tag> {
        const tag = await Database.get().tagRepository.findOneByOrFail({ id })
        return convertTag(tag)
    }
    async updateTag(id: string, data: TagUpdateData): Promise<Tag> {
        const tag = await Database.get().tagRepository.findOneByOrFail({ id })
        tag.updated = Date.now()
        tag.name = data.name
        tag.description = data.description
        tag.color = data.color
        await Database.get().tagRepository.save(tag)
        return convertTag(tag)
    }
    async deleteTag(id: string): Promise<Tag> {
        const tag = await Database.get().tagRepository.findOneByOrFail({ id })
        await Database.get().tagAssignmentRepository.update({tagId: tag.id}, { deleted: Date.now(), updated: Date.now()})
        tag.deleted = Date.now()
        tag.updated = Date.now()
        await Database.get().tagRepository.save(tag)
        return convertTag(tag)
    } 
}