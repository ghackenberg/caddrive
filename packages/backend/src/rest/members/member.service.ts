import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'



@Injectable()
export class MemberService implements MemberREST {
    private static readonly members: Member[] = [
        { id: 'demo-1', userId: 'demo-1', productId: "demo-1", deleted: false },
        { id: 'demo-2', userId: 'demo-2', productId: "demo-2", deleted: false}
    ]
    
    public constructor() {}

    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        const result: Member[] = []
        for (const member of MemberService.members) {
            if (member.deleted) {
                continue
            }
            if (member.productId != productId) {
                continue
            }
            if (userId && member.userId != userId) {
                continue
            }
            result.push(member)
        }
        return result
    }

    async addMember(data: MemberAddData): Promise<Member> {
        const members = await this.findMembers(data.productId, data.userId)
        if (members.length == 1) {
            return members[0]
        } else {
            const member = { id: shortid(), deleted: false, ...data }
            MemberService.members.push(member)
            return member
        }
    }

    async getMember(id: string): Promise<Member> {
        for (const member of MemberService.members) {
            if (member.id == id) {
                return member
            }
        }
        throw new NotFoundException()
    }

    async updateMember(id: string, data: MemberUpdateData): Promise<Member> {
        for (var index = 0; index < MemberService.members.length; index++) {
            const member = MemberService.members[index]
            if (member.id == id) {
                MemberService.members.splice(index, 1, { ...member,...data })
                return MemberService.members[index]
            }
        }
        throw new NotFoundException()
    }
    async deleteMember(id: string): Promise<Member> {
        for (const member of MemberService.members) {
            if (member.id == id) {
                member.deleted = true
                return member
            }
        }
        throw new NotFoundException()
    }
}