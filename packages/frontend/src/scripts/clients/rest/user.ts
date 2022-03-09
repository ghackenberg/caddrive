import axios from 'axios'
// Commons
import { User, UserData, UserREST } from 'productboard-common'
// Globals
import { auth } from '../auth'

class UserClient implements UserREST<UserData, File> {
    async checkUser(): Promise<User> {
        return (await axios.get<User>('/rest/users/check', { auth })).data
    }
    async findUsers(): Promise<User[]> {
        return (await axios.get<User[]>(`/rest/users`, { auth } )).data
    }
    async addUser(data: UserData, file?: File): Promise<User> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        return (await axios.post<User>('/rest/users', body, { auth })).data
    }
    async getUser(id: string): Promise<User> {
        return (await axios.get<User>(`/rest/users/${id}`, { auth })).data
    }
    async updateUser(id: string, data: UserData, file?: File): Promise<User> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        return (await axios.put<User>(`/rest/users/${id}`, body, { auth })).data
    }
    async deleteUser(id: string): Promise<User> {
        return (await axios.delete<User>(`rest/users/${id}`, { auth })).data
    }
}

export const UserAPI = new UserClient()