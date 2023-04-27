import { Member, MemberAddData, MemberUpdateData, MemberREST, MemberDownMQTT } from 'productboard-common'

import { MemberAPI } from '../clients/mqtt/member'
import { MemberClient } from '../clients/rest/member'
import { AbstractManager } from './abstract'

class MemberManagerImpl extends AbstractManager<Member> implements MemberREST, MemberDownMQTT {
    private findIndex: {[id: string]: {[id: string]: boolean}} = {}
    private findUserIndex: {[id: string]: {[id: string]: {[id: string]: boolean}}} = {}

    constructor() {
        super()
        MemberAPI.register(this)
    }

    // CACHE

    override clear() {
        super.clear()
        this.findIndex = {}
        this.findUserIndex = {}
    }

    findMembersFromCache(productId: string) { 
        const key = `${productId}`
        if (key in this.findIndex) { 
            return Object.keys(this.findIndex[key]).map(id => this.load(id))
        } else { 
            return undefined 
        } 
    }
    getMemberFromCache(memberId: string) { 
        return this.load(memberId)
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
        member = this.store(member)
        this.addToFindIndex(member)
        this.addToFindUserIndex(member)
    }
    update(member: Member): void {
        member = this.store(member)
        this.removeFromFindIndex(member)
        this.removeFromFindUserIndex(member)
        this.addToFindIndex(member)
        this.addToFindUserIndex(member)
    }
    delete(member: Member): void {
        member = this.store(member)
        this.removeFromFindIndex(member)
        this.removeFromFindUserIndex(member)
    }

    // REST

    async findMembers(productId: string, userId?: string): Promise<Member[]> {
        if (userId) {
            if (!(productId in this.findUserIndex && userId in this.findUserIndex[productId])) {
                // Call backend
                let members = await MemberClient.findMembers(productId, userId)
                // Update member index
                members = members.map(member => this.store(member))
                // Update user index
                if (!(productId in this.findUserIndex)) {
                    this.findUserIndex[productId] = {}
                }
                members.forEach(member => this.addToFindUserIndex(member))
            }
            // Return members
            return Object.keys(this.findUserIndex[productId][userId]).map(id => this.load(id)).filter(member => !member.deleted)
        } else {
            if (!(productId in this.findIndex)) {
                // Call backend
                let members = await MemberClient.findMembers(productId, userId)
                // Update member index
                members = members.map(member => this.store(member))
                // Init find index
                this.findIndex[productId] = {}
                // Update find index
                members.forEach(member => this.addToFindIndex(member))
            }
            // Return members
            return Object.keys(this.findIndex[productId]).map(id => this.load(id)).filter(member => !member.deleted)
        }
    }

    async addMember(data: MemberAddData): Promise<Member> {
        // Call backend
        let member = await MemberClient.addMember(data)
        // Update member index
        member = this.store(member)
        // Update find index
        this.addToFindIndex(member)
        // Update user index
        this.addToFindUserIndex(member)
        // Return member
        return this.load(member.id)
    }

    async getMember(id: string): Promise<Member> {
        if (!this.has(id)) {
            // Call backend
            let member = await MemberClient.getMember(id)
            // Update member index
            member = this.store(member)
            // Update find index
            this.addToFindIndex(member)
            // Update user index
            this.addToFindUserIndex(member)
        }
        // Return member
        return this.load(id)
    }

    async updateMember(id: string, data: MemberUpdateData): Promise<Member> {
        // Call backend
        let member = await MemberClient.updateMember(id, data)
        // Update member index
        member = this.store(member)
        // Update find index
        this.removeFromFindIndex(member)
        this.removeFromFindUserIndex(member)
        // Update user index
        this.addToFindIndex(member)
        this.addToFindUserIndex(member)
        // Return member
        return this.load(id)
    }

    async deleteMember(id: string): Promise<Member> {
        // Call backend
        let member = await MemberClient.deleteMember(id)
        // Update member index
        member = this.store(member)
        // Update find index
        this.removeFromFindIndex(member)
        // Update user index
        this.removeFromFindUserIndex(member)
        // Return member
        return this.load(id)
    }
}

export const MemberManager = new MemberManagerImpl()