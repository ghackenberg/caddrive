import { Member, MemberData, MemberREST } from 'productboard-common'
import { MemberAPI } from '../clients/rest/member'

class MemberManagerImpl implements MemberREST {
    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        return MemberAPI.findMembers(productId, userId)
    }
    async addMember(data: MemberData): Promise<Member> {
        return MemberAPI.addMember(data)
    }
    async getMember(id: string): Promise<Member> {
        return MemberAPI.getMember(id)
    }
    async updateMember(id: string, data: MemberData): Promise<Member> {
        return MemberAPI.updateMember(id, data)
    }
    async deleteMember(id: string): Promise<Member> {
        return MemberAPI.deleteMember(id)
    }
}

export const MemberManager = new MemberManagerImpl()