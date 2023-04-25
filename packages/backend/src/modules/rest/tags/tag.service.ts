import { Injectable } from '@nestjs/common'

import * as shortid from 'shortid'

import { Tag, TagAddData, TagREST, TagUpdateData } from "productboard-common"
import { Database, TagEntity } from 'productboard-database'

@Injectable()
export class TagService implements TagREST {
    async findTags(): Promise<Tag[]> {
        const result: Tag[] = []
        for (const tag of await Database.get().tagRepository.find())
            result.push(this.convert(tag))
        return result
    }
    async addTag(data: TagAddData): Promise<Tag> {
        const tag = await Database.get().tagRepository.save({id: shortid(), deleted: false, ...data})
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
        return { id: tag.id, deleted: tag.deleted, name: tag.name, color: tag.color }
    }
}