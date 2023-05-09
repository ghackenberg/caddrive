import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'

import { MemberClient } from '../clients/rest/member'
import { AbstractManager } from './abstract'

class MemberManagerImpl extends AbstractManager<Member> implements MemberREST {
    // CACHE

    findMembersFromCache(productId: string, userId?: string) { 
        return this.getFind(`${productId}-${userId}`)
    }
    getMemberFromCache(memberId: string) { 
        return this.getItem(memberId)
    }

    // REST

    async findMembers(productId: string, userId?: string) {
        return this.find(
            `${productId}-${userId}`,
            () => MemberClient.findMembers(productId, userId),
            member => (!productId || member.productId == productId) && (!userId || member.userId == userId)
        )
    }
    async addMember(data: MemberAddData) {
        return this.add(MemberClient.addMember(data))
    }
    async getMember(id: string) {
        return this.get(id, () => MemberClient.getMember(id))
    }
    async updateMember(id: string, data: MemberUpdateData) {
        return this.update(id, MemberClient.updateMember(id, data))
    }
    async deleteMember(id: string) {
        return this.delete(id, MemberClient.deleteMember(id))
    }
}

export const MemberManager = new MemberManagerImpl()