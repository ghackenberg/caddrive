import axios from 'axios'

import { MemberCreate, MemberREST, MemberRead, MemberUpdate } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class MemberClientImpl implements MemberREST {
    async findMembers(productId: string): Promise<MemberRead[]> {
        return (await axios.get<MemberRead[]>(`/rest/products/${productId}/members`, auth)).data
    }
    async addMember(productId: string, data: MemberCreate): Promise<MemberRead> {
        const member = (await axios.post<MemberRead>(`/rest/products/${productId}/members`, data, auth)).data
        CacheAPI.putMember(member)
        return member
    }
    async getMember(productId: string, memberId: string): Promise<MemberRead> {
        return (await axios.get<MemberRead>(`/rest/products/${productId}/members/${memberId}`, auth)).data
    }
    async updateMember(productId: string, memberId: string, data: MemberUpdate): Promise<MemberRead> {
        const member = (await axios.put<MemberRead>(`/rest/products/${productId}/members/${memberId}`, data, auth)).data
        CacheAPI.putMember(member)
        return member
    }
    async deleteMember(productId: string, memberId: string): Promise<MemberRead> {
        const member = (await axios.delete<MemberRead>(`/rest/products/${productId}/members/${memberId}`, auth)).data
        CacheAPI.putMember(member)
        return member
    }

}

export const MemberClient = new MemberClientImpl()