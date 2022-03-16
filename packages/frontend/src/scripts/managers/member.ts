import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'
import { MemberClient } from '../clients/rest/member'

class MemberManagerImpl implements MemberREST {
    private memberIndex: {[id: string]: Member} = {}
    private productIndex: {[id: string]: {[id: string]: boolean}} = {}
    private userIndex: {[id: string]: {[id: string]: {[id: string]: boolean}}} = {}

    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        if (userId) {
            if (!(productId in this.userIndex && userId in this.userIndex[productId])) {
                // Call backend
                const members = await MemberClient.findMembers(productId, userId)
                // Update member index
                for (const member of members) {
                    this.memberIndex[member.id] = member
                }
                // Update user index
                if (!(productId in this.userIndex)) {
                    this.userIndex[productId] = {}
                }
                for (const member of members) {
                    this.userIndex[productId][userId][member.id] = true
                }
            }
            // Return members
            return Object.keys(this.userIndex[productId][userId]).map(id => this.memberIndex[id])
        } else {
            if (!(productId in this.productIndex)) {
                // Call backend
                const members = await MemberClient.findMembers(productId, userId)
                // Update member index
                for (const member of members) {
                    this.memberIndex[member.id] = member
                }
                // Update product index
                this.productIndex[productId] = {}
                for (const member of members) {
                    this.productIndex[productId][member.id] = true
                }
            }
            // Return members
            return Object.keys(this.productIndex[productId]).map(id => this.memberIndex[id])
        }
    }

    async addMember(data: MemberAddData): Promise<Member> {
        // Call backend
        const member = await MemberClient.addMember(data)
        // Update member index
        this.memberIndex[member.id] = member
        // Update product index
        if (member.productId in this.productIndex) {
            this.productIndex[member.productId][member.id] = true
        }
        // Update user index
        if (member.productId in this.userIndex && member.userId in this.userIndex[member.productId]) {
            this.userIndex[member.productId][member.userId][member.id] = true
        }
        // Return member
        return member
    }

    async getMember(id: string): Promise<Member> {
        if (!(id in this.memberIndex)) {
            // Call backend
            const member = await MemberClient.getMember(id)
            // Update member index
            this.memberIndex[id] = member
            // Update product index
            if (member.productId in this.productIndex) {
                this.productIndex[member.productId][id] = true
            }
            // Update user index
            if (member.productId in this.userIndex && member.userId in this.userIndex[member.productId]) {
                this.userIndex[member.productId][member.userId][id] = true
            }
        }
        // Return member
        return this.memberIndex[id]
    }

    async updateMember(id: string, data: MemberUpdateData): Promise<Member> {
        if (id in this.memberIndex) {
            const member = this.memberIndex[id]
            // Update product index
            if (member.productId in this.productIndex) {
                delete this.productIndex[member.productId][id]
            }
            // Update user index
            if (member.productId in this.userIndex && member.userId in this.userIndex[member.productId]) {
                delete this.userIndex[member.productId][member.userId][id]
            }
        }
        // Call backend
        const member = await MemberClient.updateMember(id, data)
        // Update member index
        this.memberIndex[member.id] = member
        // Update product index
        if (member.productId in this.productIndex) {
            this.productIndex[member.productId][id] = true
        }
        // Update user index
        if (member.productId in this.userIndex && member.userId in this.userIndex[member.productId]) {
            this.userIndex[member.productId][member.userId][id] = true
        }
        // Return member
        return this.memberIndex[id]
    }

    async deleteMember(id: string): Promise<Member> {
        // Call backend
        const member = await MemberClient.deleteMember(id)
        // Update member index
        this.memberIndex[member.id] = member
        // Update product index
        if (member.productId in this.productIndex) {
            delete this.productIndex[member.productId][id]
        }
        // Update user index
        if (member.productId in this.userIndex && member.userId in this.userIndex[member.productId]) {
            delete this.userIndex[member.productId][member.userId][id]
        }
        // Return member
        return this.memberIndex[id]
    }
}

export const MemberManager = new MemberManagerImpl()