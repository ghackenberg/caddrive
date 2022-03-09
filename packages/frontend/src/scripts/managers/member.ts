import { Member, MemberData, MemberREST } from 'productboard-common'
import { MemberClient } from '../clients/rest/member'

class MemberManagerImpl implements MemberREST {
    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        return MemberClient.findMembers(productId, userId)
    }
    async addMember(data: MemberData): Promise<Member> {
        return MemberClient.addMember(data)
    }
    async getMember(id: string): Promise<Member> {
        return MemberClient.getMember(id)
    }
    async updateMember(id: string, data: MemberData): Promise<Member> {
        return MemberClient.updateMember(id, data)
    }
    async deleteMember(id: string): Promise<Member> {
        return MemberClient.deleteMember(id)
    }
}

export const MemberManager = new MemberManagerImpl()