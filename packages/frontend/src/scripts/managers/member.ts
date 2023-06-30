import { Member, MemberAddData, MemberUpdateData } from 'productboard-common'

import { AbstractManager } from './abstract'
import { MemberClient } from '../clients/rest/member'

class MemberManagerImpl extends AbstractManager<Member> {
    // CACHE

    findMembersFromCache(productId: string, userId?: string) { 
        return this.getFind(`${productId}-${userId}`)
    }
    getMemberFromCache(memberId: string) { 
        return this.getItem(memberId)
    }

    // REST

    findMembers(productId: string, userId: string, callback: (members: Member[], error?: string) => void) {
        return this.find(
            `${productId}-${userId}`,
            () => MemberClient.findMembers(productId, userId),
            member => (!productId || member.productId == productId) && (!userId || member.userId == userId),
            (a, b) => a.created - b.created,
            callback
        )
    }
    async addMember(data: MemberAddData) {
        return this.resolveItem(await MemberClient.addMember(data))
    }
    getMember(id: string, callback: (member: Member, error?: string) => void) {
        return this.observeItem(id, () => MemberClient.getMember(id), callback)
    }
    async updateMember(id: string, data: MemberUpdateData) {
        return this.promiseItem(id, MemberClient.updateMember(id, data))
    }
    async deleteMember(id: string) {
        return this.promiseItem(id, MemberClient.deleteMember(id))
    }
}

export const MemberManager = new MemberManagerImpl('member')