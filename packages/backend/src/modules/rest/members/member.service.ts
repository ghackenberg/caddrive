import { Injectable } from '@nestjs/common'
import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'
import { MemberEntity, MemberRepository, ProductRepository, UserRepository } from 'productboard-database'
import * as shortid from 'shortid'
import { FindOptionsWhere } from 'typeorm'

@Injectable()
export class MemberService implements MemberREST {
    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        let where: FindOptionsWhere<MemberEntity>
        if (productId && userId) 
            where = { productId, userId, deleted: false }
        else if (productId)
            where = { productId, deleted: false }
        const result: Member[] = []
        for (const member of await MemberRepository.findBy(where))
            result.push(this.convert(member))
        return result
    }

    async addMember(data: MemberAddData): Promise<Member> {
        const product = await ProductRepository.findOneByOrFail({ id: data.productId })
        const user = await UserRepository.findOneByOrFail({ id: data.userId })
        const member = await MemberRepository.save({ id: shortid(), deleted: false, product, user, ...data })
        return this.convert(member)
    }

    async getMember(id: string): Promise<Member> {
       const member = await MemberRepository.findOneByOrFail({ id })
        return this.convert(member)
    }

    async updateMember(id: string, _data: MemberUpdateData): Promise<Member> {
        const member = await MemberRepository.findOneByOrFail({ id })
        member.role = _data.role
        await MemberRepository.save(member)
        return this.convert(member)
    }
    
    async deleteMember(id: string): Promise<Member> {
        const member = await MemberRepository.findOneByOrFail({ id })
        member.deleted = true
        await MemberRepository.save(member)
        return this.convert(member)
    }

    private convert(member: MemberEntity) {
        return { id: member.id, deleted: member.deleted, productId: member.productId, userId: member.userId, role: member.role }
    }
}