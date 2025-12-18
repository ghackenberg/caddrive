import axios from 'axios'

import { UserREST, UserRead, UserUpdate } from 'productboard-common'

import { auth } from '../auth'
import { CacheAPI } from '../cache'

class UserClientImpl implements UserREST<UserUpdate, File> {
    async findUsers(productId?: string, query?: string): Promise<UserRead[]> {
        return (await axios.get<UserRead[]>(`/rest/users`, { params: { productId, query }, ...auth } )).data
    }
    async getUser(userId: string): Promise<UserRead> {
        return (await axios.get<UserRead>(`/rest/users/${userId}`, auth)).data
    }
    async updateUser(userId: string, data: UserUpdate, file?: File): Promise<UserRead> {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        body.append('file', file)
        const user = (await axios.put<UserRead>(`/rest/users/${userId}`, body, auth)).data
        CacheAPI.putUser(user)
        return user
    }
    async deleteUser(userId: string): Promise<UserRead> {
        const user = (await axios.delete<UserRead>(`rest/users/${userId}`, auth)).data
        CacheAPI.putUser(user)
        return user
    }
}

export const UserClient = new UserClientImpl()