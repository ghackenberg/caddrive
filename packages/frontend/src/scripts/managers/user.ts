import { User, UserUpdateData, UserREST, UserDownMQTT } from 'productboard-common'

import { UserAPI } from '../clients/mqtt/user'
import { UserClient } from '../clients/rest/user'
import { AbstractManager } from './abstract'

class UserManagerImpl extends AbstractManager<User> implements UserREST<UserUpdateData, File>, UserDownMQTT {
    private findIndex: {[id: string]: boolean}

    constructor() {
        super()
        UserAPI.register(this)
    }

    // CACHE

    override clear() {
        super.clear()
        this.findIndex = undefined
    }

    findUsersFromCache() { 
        if (this.findIndex) { 
            return Object.keys(this.findIndex).map(id => this.load(id))
        } else { 
            return undefined 
        } 
    }
    getUserFromCache(userId: string) { 
        return this.load(userId)
    }

    private addToFindIndex(user: User) {
        if (this.findIndex) {
            this.findIndex[user.id] = true
        }
    }
    private removeFromFindIndex(user: User) {
        if (this.findIndex) {
            delete this.findIndex[user.id]
        }
    }

    // MQTT

    create(user: User): void {
        user = this.store(user)
        this.addToFindIndex(user)
    }
    update(user: User): void {
        user = this.store(user)
        this.removeFromFindIndex(user)
        this.addToFindIndex(user)
    }
    delete(user: User): void {
        user = this.store(user)
        this.removeFromFindIndex(user)
    }

    // REST

    async findUsers(query?: string, product?: string): Promise<User[]> {
        if (query || product) {
            return await UserClient.findUsers(query, product)
        }
        if (!this.findIndex) {
            // Call backend
            let users = await UserClient.findUsers(query, product)
            // Update user index
            users = users.map(user => this.store(user))
            // Init find index
            this.findIndex = {}
            // Update find index
            users.map(user => this.addToFindIndex(user))
        }
        // Return users
        return Object.keys(this.findIndex).map(id => this.load(id)).filter(user => !user.deleted)
    }

    async getUser(id: string): Promise<User> {
        if (!this.has(id)) {
            // Call backend
            let user = await UserClient.getUser(id)
            // Update user index
            user = this.store(user)
            // Update find index
            this.addToFindIndex(user)
        }
        // Return user
        return this.load(id)
    }

    async updateUser(id: string, data: UserUpdateData, file?: File): Promise<User> {
        // Call backend
        let user = await UserClient.updateUser(id, data, file)
        // Update user index
        user = this.store(user)
        // Update find result
        this.removeFromFindIndex(user)
        this.addToFindIndex(user)
        // Return user
        return this.load(id)
    }

    async deleteUser(id: string): Promise<User> {
        // Call backend
        let user = await UserClient.deleteUser(id)
        // Update user index
        user = this.store(user)
        // Update user set
        this.removeFromFindIndex(user)
        // Return user
        return this.load(id)
    }
}

export const UserManager = new UserManagerImpl()