import { Member, MemberData, MemberREST } from 'productboard-common'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as shortid from 'shortid'



@Injectable()
export class MemberService implements MemberREST {
    private static readonly members: Member[] = [
        { id: 'demo-1', userId: 'demo-1', productId: "demo-1"},
        { id: 'demo-2', userId: 'demo-2', productId: "demo-2"}
    ]
    
    public constructor() {}

    async findMembers(productId: string): Promise<Member[]> {
        const result: Member[] = []
        for (const member of MemberService.members) {
            if (member.productId != productId) {
                continue
            }
            result.push(member)
        }

        return result
    }

    async addMember(data: MemberData): Promise<Member> {
        const member = { id: shortid(), ...data }
        MemberService.members.push(member)
        return member
    }

    async getMember(id: string): Promise<Member> {
        for (const member of MemberService.members) {
            if (member.id == id) {
                return member
            }
        }
        throw new NotFoundException()
    }

    async updateMember(id: string, data: MemberData): Promise<Member> {
        for (var index = 0; index < MemberService.members.length; index++) {
            const member = MemberService.members[index]
            if (member.id == id) {
                MemberService.members.splice(index, 1, { id, ...data })
                return MemberService.members[index]
            }
        }
        throw new NotFoundException()
    }
    async deleteMember(id: string): Promise<Member> {
        for (var index = 0; index < MemberService.members.length; index++) {
            const member = MemberService.members[index]
            if (member.id == id) {
                // Todo
                // for (const member of await this.MemberService.findMembers(id)) {
                //     await this.MemberService.deleteMember(member.id)
                // }
                // member.deleted = true
                return member
            }
        }
        throw new NotFoundException()
    }
    

}