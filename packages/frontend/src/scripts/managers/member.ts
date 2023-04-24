import { Member, MemberAddData, MemberUpdateData, MemberREST, MemberDownMQTT } from 'productboard-common'

import { MemberAPI } from '../clients/mqtt/member'
import { MemberClient } from '../clients/rest/member'

class MemberManagerImpl implements MemberREST, MemberDownMQTT {
    private memberIndex: {[id: string]: Member} = {}
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}
    private findUserIndex: {[id: string]: {[id: string]: {[id: string]: boolean}}} = {}

    constructor() {
        MemberAPI.register(this)
    }

    // CACHE

    findMembersFromCache(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.memberIndex[id])
        } else { 
            return undefined 
        } 
    }
    getMemberFromCache(memberId: string) { 
        if (memberId in this.memberIndex) { 
            return this.memberIndex[memberId]
        } else { 
            return undefined 
        } 
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

    private addToFindUserIndex(member: Member) {
        if (member.productId in this.findUserIndex && member.userId in this.findUserIndex[member.productId]) {
            this.findUserIndex[member.productId][member.userId][member.id] = true
        }
    }
    private removeFromFindUserIndex(member: Member) {
        if (member.productId in this.findUserIndex && member.userId in this.findUserIndex[member.productId]) {
            delete this.findUserIndex[member.productId][member.userId][member.id]
        }
    }

    // MQTT

    create(member: Member): void {
        this.memberIndex[member.id] = member
        this.addToFindIndex(member)
        this.addToFindUserIndex(member)
    }
    update(member: Member): void {
        this.memberIndex[member.id] = member
        this.removeFromFindIndex(member)
        this.removeFromFindUserIndex(member)
        this.addToFindIndex(member)
        this.addToFindUserIndex(member)
    }
    delete(member: Member): void {
        this.memberIndex[member.id] = member
        this.removeFromFindIndex(member)
        this.removeFromFindUserIndex(member)
    }

    // REST

    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        if (userId) {
            if (!(productId in this.findUserIndex && userId in this.findUserIndex[productId])) {
                // Call backend
                const members = await MemberClient.findMembers(productId, userId)
                // Update member index
                for (const member of members) {
                    this.memberIndex[member.id] = member
                }
                // Update user index
                if (!(productId in this.findUserIndex)) {
                    this.findUserIndex[productId] = {}
                }
                for (const member of members) {
                    this.findUserIndex[productId][userId][member.id] = true
                }
            }
            // Return members
            return Object.keys(this.findUserIndex[productId][userId]).map(id => this.memberIndex[id])
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
       this.addToFindUserIndex(member)
        // Return member
        return member
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
        this.removeFromFindUserIndex(member)
        this.addToFindUserIndex(member)
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
        this.removeFromFindUserIndex(member)
        // Return member
        return this.memberIndex[id]
    }
}

export const MemberManager = new MemberManagerImpl()