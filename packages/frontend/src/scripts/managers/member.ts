import { Member, MemberAddData, MemberUpdateData, MemberREST, MemberDownMQTT } from 'productboard-common'

import { MemberAPI } from '../clients/mqtt/member'
import { MemberClient } from '../clients/rest/member'

class MemberManagerImpl implements MemberREST, MemberDownMQTT {
    private memberIndex: {[id: string]: Member} = {}
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}
    private userIndex: {[id: string]: {[id: string]: {[id: string]: boolean}}} = {}

    constructor() {
        MemberAPI.register(this)
    }

    // MQTT

    create(member: Member): void {
        console.log(`Member created ${member}`)
        this.memberIndex[member.id] = member
        this.addToFindIndex(member)
        this.addToUserIndex(member)
    }

    update(member: Member): void {
        console.log(`Member updated ${member}`)
        this.memberIndex[member.id] = member
        this.removeFromFindIndex(member)
        this.addToFindIndex(member)
        this.removeFromUserIndex(member)
        this.addToUserIndex(member)
    }

    delete(member: Member): void {
        console.log(`Member deleted ${member}`)
        this.memberIndex[member.id] = member
        this.removeFromFindIndex(member)
        this.removeFromUserIndex(member)
    }

    getMemberCount(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).length 
        } else { 
            return undefined 
        } 
    }

    findMembersFromCache(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.memberIndex[id])
        } else { 
            return undefined 
        } 
    }

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
            if (!(productId in this.findIndex)) {
                // Call backend
                const members = await MemberClient.findMembers(productId, userId)
                // Update member index
                for (const member of members) {
                    this.memberIndex[member.id] = member
                }
                // Update find index
                this.findIndex[productId] = {}
                for (const member of members) {
                    this.findIndex[productId][member.id] = true
                }
            }
            // Return members
            return Object.keys(this.findIndex[productId]).map(id => this.memberIndex[id])
        }
    }

    async addMember(data: MemberAddData): Promise<Member> {
        // Call backend
        const member = await MemberClient.addMember(data)
        // Update member index
        this.memberIndex[member.id] = member
        // Update find index
        this.addToFindIndex(member)
        // Update user index
       this.addToUserIndex(member)
        // Return member
        return member
    }

    getMemberFromCache(memberId: string) { 
        if (memberId in this.memberIndex) { 
            return this.memberIndex[memberId]
        } else { 
            return undefined 
        } 
    }

    async getMember(id: string): Promise<Member> {
        if (!(id in this.memberIndex)) {
            // Call backend
            const member = await MemberClient.getMember(id)
            // Update member index
            this.memberIndex[id] = member
        }
        // Return member
        return this.memberIndex[id]
    }

    async updateMember(id: string, data: MemberUpdateData): Promise<Member> {
        // Call backend
        const member = await MemberClient.updateMember(id, data)
        // Update member index
        this.memberIndex[member.id] = member
        // Update find index
        this.removeFromFindIndex(member)
        this.addToFindIndex(member)
        // Update user index
        this.removeFromUserIndex(member)
        this.addToUserIndex(member)
        // Return member
        return this.memberIndex[id]
    }

    async deleteMember(id: string): Promise<Member> {
        // Call backend
        const member = await MemberClient.deleteMember(id)
        // Update member index
        this.memberIndex[member.id] = member
        // Update find index
        this.removeFromFindIndex(member)
        // Update user index
        this.removeFromUserIndex(member)
        // Return member
        return this.memberIndex[id]
    }

    private addToFindIndex(member: Member) {
        if (`${member.productId}` in this.findIndex) {
            this.findIndex[`${member.productId}`][member.id] = true
        }
    }

    private removeFromFindIndex(member: Member) { 
        for (const key of Object.keys(this.findIndex)) {
            if (member.id in this.findIndex[key]) {
                delete this.findIndex[key][member.id]
            }
        }
    }

    private addToUserIndex(member: Member) {
        if (member.productId in this.userIndex && member.userId in this.userIndex[member.productId]) {
            this.userIndex[member.productId][member.userId][member.id] = true
        }
    }

    private removeFromUserIndex(member: Member) {
        if (member.productId in this.userIndex && member.userId in this.userIndex[member.productId]) {
            delete this.userIndex[member.productId][member.userId][member.id]
        }
    }
}

export const MemberManager = new MemberManagerImpl()