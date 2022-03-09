import axios from 'axios'
// Commons
import { Member, MemberData, MemberREST } from 'productboard-common'
// Globals
import { auth } from '../auth'

class MemberClientImpl implements MemberREST {
    async findMembers(product: string, user?: string): Promise<Member[]> {
        return (await axios.get<Member[]>('/rest/members', { params: { product, user }, auth })).data
    }
    async addMember(data: MemberData): Promise<Member> {
        return (await axios.post<Member>('/rest/members', data, { auth })).data
    }
    async getMember(id: string): Promise<Member> {
        return (await axios.get<Member>(`/rest/members/${id}`, { auth })).data
    }
    async updateMember(id: string, data: MemberData): Promise<Member> {
        return (await axios.put<Member>(`/rest/members/${id}`, data, { auth })).data
    }
    async deleteMember(id: string): Promise<Member> {
        return (await axios.delete<Member>(`/rest/members/${id}`, { auth })).data
    }

}

export const MemberClient = new MemberClientImpl()