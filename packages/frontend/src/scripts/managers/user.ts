import { User, UserUpdateData } from 'productboard-common'

import { UserClient } from '../clients/rest/user'
import { AbstractManager } from './abstract'

class UserManagerImpl extends AbstractManager<User> {
    // CACHE

    findUsersFromCache() {
        return this.getFind(`${undefined}-${undefined}`)
    }
    getUserFromCache(userId: string) { 
        return this.getItem(userId)
    }

    // REST

    findUsers(query: string, product: string, callback: (users: User[], error?: string) => void) {
        return this.find(
            `${query}-${product}`,
            () => UserClient.findUsers(query, product),
            () => false,
            (a, b) => a.updated - b.updated,
            callback
        )
    }
    getUser(id: string, callback: (user: User, error?: string) => void) {
        return this.observeItem(id, () => UserClient.getUser(id), callback)
    }
    async updateUser(id: string, data: UserUpdateData, file?: File) {
        return this.promiseItem(id, UserClient.updateUser(id, data, file))
    }
    async deleteUser(id: string) {
        return this.promiseItem(id, UserClient.deleteUser(id))
    }
}

export const UserManager = new UserManagerImpl('user')