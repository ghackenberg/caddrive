import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'
import { Database, MemberEntity } from 'productboard-database'

@Injectable()
export class MemberService implements MemberREST {
    constructor(
        @Inject('MQTT')
        private readonly client: ClientProxy
    ) {

    }

    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        let where: FindOptionsWhere<MemberEntity>
        if (productId && userId) 
            where = { productId, userId, deleted: false }
        else if (productId)
            where = { productId, deleted: false }
        const result: Member[] = []
        for (const member of await Database.get().memberRepository.findBy(where))
            result.push(this.convert(member))
        return result
    }

    async addMember(data: MemberAddData): Promise<Member> {
        const product = await Database.get().productRepository.findOneByOrFail({ id: data.productId })
        const user = await Database.get().userRepository.findOneByOrFail({ id: data.userId })
        const member = await Database.get().memberRepository.save({ id: shortid(), deleted: false, product, user, ...data })
        await this.client.emit(`/api/v1/members/${member.id}/create`, this.convert(member))
        return this.convert(member)
    }

    async getMember(id: string): Promise<Member> {
       const member = await Database.get().memberRepository.findOneByOrFail({ id })
        return this.convert(member)
    }

    async updateMember(id: string, _data: MemberUpdateData): Promise<Member> {
        const member = await Database.get().memberRepository.findOneByOrFail({ id })
        member.role = _data.role
        await Database.get().memberRepository.save(member)
        await this.client.emit(`/api/v1/members/${member.id}/update`, this.convert(member))
        return this.convert(member)
    }
    
    async deleteMember(id: string): Promise<Member> {
        const member = await Database.get().memberRepository.findOneByOrFail({ id })
        member.deleted = true
        await Database.get().memberRepository.save(member)
        await this.client.emit(`/api/v1/members/${member.id}/delete`, this.convert(member))
        return this.convert(member)
    }

    private convert(member: MemberEntity) {
        return { id: member.id, deleted: member.deleted, productId: member.productId, userId: member.userId, role: member.role }
    }
}