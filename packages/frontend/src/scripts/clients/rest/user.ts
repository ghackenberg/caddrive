import axios from 'axios'

import { User, UserUpdateData, UserREST } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class UserClientImpl implements UserREST<UserUpdateData, File> {
    async findUsers(productId?: string, query?: string): Promise<User[]> {
        return (await axios.get<User[]>(`/rest/users`, { params: { productId, query }, ...auth } )).data
    }
    async getUser(userId: string): Promise<User> {
        return (await axios.get<User>(`/rest/users/${userId}`, auth)).data
    }
    async updateUser(userId: string, data: UserUpdateData, file?: File): Promise<User> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        const user = (await axios.put<User>(`/rest/users/${userId}`, body, auth)).data
        CacheAPI.putUser(user)
        return user
    }
    async deleteUser(userId: string): Promise<User> {
        const user = (await axios.delete<User>(`rest/users/${userId}`, auth)).data
        CacheAPI.putUser(user)
        return user
    }
}

export const UserClient = new UserClientImpl()