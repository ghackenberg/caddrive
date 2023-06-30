import { Injectable } from '@nestjs/common'

import shortid from 'shortid'
import { FindOptionsWhere, IsNull } from 'typeorm'

import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'
import { Database, MemberEntity } from 'productboard-database'

import { convertMember } from '../../../functions/convert'
import { emitMember } from '../../../functions/emit'

@Injectable()
export class MemberService implements MemberREST {
    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        let where: FindOptionsWhere<MemberEntity>
        if (productId && userId) 
            where = { productId, userId, deleted: IsNull() }
        else if (productId)
            where = { productId, deleted: IsNull() }
        const result: Member[] = []
        for (const member of await Database.get().memberRepository.findBy(where))
            result.push(convertMember(member))
        return result
    }

    async addMember(data: MemberAddData): Promise<Member> {
        // Create member
        const product = await Database.get().productRepository.findOneByOrFail({ id: data.productId })
        const user = await Database.get().userRepository.findOneByOrFail({ id: data.userId })
        const id = shortid()
        const created = Date.now()
        const updated = created
        const member = await Database.get().memberRepository.save({ id, created, updated, product, user, ...data })
        // Emit changes
        emitMember(member)
        // Return member
        return convertMember(member)
    }

    async getMember(id: string): Promise<Member> {
       const member = await Database.get().memberRepository.findOneByOrFail({ id })
        return convertMember(member)
    }

    async updateMember(id: string, data: MemberUpdateData): Promise<Member> {
        // Update member
        const member = await Database.get().memberRepository.findOneByOrFail({ id })
        member.updated = Date.now()
        member.role = data.role
        await Database.get().memberRepository.save(member)
        // Emit changes
        emitMember(member)
        // Return member
        return convertMember(member)
    }
    
    async deleteMember(id: string): Promise<Member> {
        // Update member
        const member = await Database.get().memberRepository.findOneByOrFail({ id })
        member.deleted = Date.now()
        member.updated = member.deleted
        await Database.get().memberRepository.save(member)
        // Emit changes
        emitMember(member)
        // Return member
        return convertMember(member)
    }
}