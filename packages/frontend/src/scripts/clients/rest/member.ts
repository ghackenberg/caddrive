import axios from 'axios'

import { Member, MemberAddData, MemberUpdateData, MemberREST } from 'productboard-common'

import { auth } from '../auth'
import { MqttAPI } from '../mqtt'

class MemberClientImpl implements MemberREST {
    async findMembers(productId: string): Promise<Member[]> {
        return (await axios.get<Member[]>(`/rest/products/${productId}/members`, auth)).data
    }
    async addMember(productId: string, data: MemberAddData): Promise<Member> {
        const member = (await axios.post<Member>(`/rest/products/${productId}/members`, data, auth)).data
        MqttAPI.publishMemberLocal(member)
        return member
    }
    async getMember(productId: string, memberId: string): Promise<Member> {
        return (await axios.get<Member>(`/rest/products/${productId}/members/${memberId}`, auth)).data
    }
    async updateMember(productId: string, memberId: string, data: MemberUpdateData): Promise<Member> {
        const member = (await axios.put<Member>(`/rest/products/${productId}/members/${memberId}`, data, auth)).data
        MqttAPI.publishMemberLocal(member)
        return member
    }
    async deleteMember(productId: string, memberId: string): Promise<Member> {
        const member = (await axios.delete<Member>(`/rest/products/${productId}/members/${memberId}`, auth)).data
        MqttAPI.publishMemberLocal(member)
        return member
    }

}

export const MemberClient = new MemberClientImpl()