import axios from 'axios'

import { User, UserAddData, UserUpdateData, UserREST } from 'productboard-common'

import { auth } from '../auth'

class UserClientImpl implements UserREST<UserAddData, File> {
    async checkUser(): Promise<User> {
        return (await axios.get<User>('/rest/users/check', { auth })).data
    }
    async findUsers(query?: string, product?: string): Promise<User[]> {
        return (await axios.get<User[]>(`/rest/users`, { params: { query, product }, auth } )).data
    }
    async addUser(data: UserAddData, file?: File): Promise<User> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        return (await axios.post<User>('/rest/users', body, { auth })).data
    }
    async getUser(id: string): Promise<User> {
        return (await axios.get<User>(`/rest/users/${id}`, { auth })).data
    }
    async updateUser(id: string, data: UserUpdateData, file?: File): Promise<User> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        return (await axios.put<User>(`/rest/users/${id}`, body, { auth })).data
    }
    async deleteUser(id: string): Promise<User> {
        return (await axios.delete<User>(`rest/users/${id}`, { auth })).data
    }
}

export const UserClient = new UserClientImpl()