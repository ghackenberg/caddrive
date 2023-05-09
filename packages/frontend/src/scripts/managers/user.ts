import { User, UserUpdateData, UserREST } from 'productboard-common'

import { UserClient } from '../clients/rest/user'
import { AbstractManager } from './abstract'

class UserManagerImpl extends AbstractManager<User> implements UserREST<UserUpdateData, File> {
    // CACHE

    findUsersFromCache() {
        return this.getFind(`${undefined}-${undefined}`)
    }
    getUserFromCache(userId: string) { 
        return this.getItem(userId)
    }

    // REST

    async findUsers(query?: string, product?: string) {
        return this.find(
            `${query}-${product}`,
            () => UserClient.findUsers(query, product),
            () => false
        )
    }
    async getUser(id: string) {
        return this.get(id, () => UserClient.getUser(id))
    }
    async updateUser(id: string, data: UserUpdateData, file?: File) {
        return this.update(id, UserClient.updateUser(id, data, file))
    }
    async deleteUser(id: string) {
        return this.delete(id, UserClient.deleteUser(id))
    }
}

export const UserManager = new UserManagerImpl()