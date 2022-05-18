import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'
import { MemberEntity, MemberRepository, ProductRepository, UserRepository } from 'productboard-database'

@Injectable()
export class MemberService implements MemberREST {
    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        const result: Member[] = []
        const where = userId ? { deleted: false, productId, userId } : { deleted: false, productId }
        for (const member of await MemberRepository.find({ where })) {
            result.push(this.convert(member))
        }
        return result
    }

    async addMember(data: MemberAddData): Promise<Member> {
        const product = await ProductRepository.findOne({ where: { id: data.productId } })
        if (!product) {
            throw new NotFoundException()
        }
        const user = await UserRepository.findOne({ where: { id: data.userId } })
        if (!user) {
            throw new NotFoundException()
        }
        const member = await MemberRepository.save({ id: shortid(), deleted: false, product, user })
        return this.convert(member)
    }

    async getMember(id: string): Promise<Member> {
       const member = await MemberRepository.findOne({ where: { id } })
        if (!member) {
            throw new NotFoundException()
        }
        return this.convert(member)
    }

    async updateMember(id: string, _data: MemberUpdateData): Promise<Member> {
        const member = await MemberRepository.findOne({ where: { id } })
        if (!member) {
            throw new NotFoundException()
        }
        await MemberRepository.save(member)
        return this.convert(member)
    }
    
    async deleteMember(id: string): Promise<Member> {
        const member = await MemberRepository.findOne({ where: { id } })
        if (!member) {
            throw new NotFoundException()
        }
        member.deleted = true
        await MemberRepository.save(member)
        return this.convert(member)
    }

    private convert(member: MemberEntity) {
        return { id: member.id, deleted: member.deleted, productId: member.productId, userId: member.userId }
    }
}