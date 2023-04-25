import { Injectable } from '@nestjs/common'

import shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Tag, TagAddData, TagREST, TagUpdateData } from "productboard-common"
import { Database, TagEntity } from 'productboard-database'

@Injectable()
export class TagService implements TagREST {
 
    async findTags(productId: string) : Promise<Tag[]> {
        let where: FindOptionsWhere<TagEntity>
        if (productId)
            where = { productId, deleted: null }
        const result: Tag[] = []
        for (const tag of await Database.get().tagRepository.findBy(where))
            result.push(this.convert(tag))
        return result
    }

    async addTag(data: TagAddData): Promise<Tag> {
        const id = shortid()
        const tag = await Database.get().tagRepository.save({id: id, deleted: false, ...data})
        return this.convert(tag)
    }
    async getTag(id: string): Promise<Tag> {
        const tag = await Database.get().tagRepository.findOneByOrFail({ id })
        return this.convert(tag)
    }
    async updateTag(id: string, data: TagUpdateData): Promise<Tag> {
        const tag = await Database.get().tagRepository.findOneByOrFail({ id })
        tag.name = data.name
        tag.color = data.color
        await Database.get().tagRepository.save(tag)
        return this.convert(tag)
    }
    async deleteTag(id: string): Promise<Tag> {
        const tag = await Database.get().tagRepository.findOneByOrFail({ id })
        tag.deleted = true
        await Database.get().tagRepository.save(tag)
        return this.convert(tag)
    } 

    private convert(tag: TagEntity) {
        return { id: tag.id, deleted: tag.deleted, productId:tag.productId, name: tag.name, color: tag.color }
    }
}