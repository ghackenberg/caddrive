import { User, UserAddData, UserUpdateData, UserREST, UserDownMQTT } from 'productboard-common'

import { UserAPI } from '../clients/mqtt/user'
import { UserClient } from '../clients/rest/user'

class UserManagerImpl implements UserREST<UserAddData, File>, UserDownMQTT {
    private userIndex: {[id: string]: User} = {}
    private findResult: {[id: string]: boolean}

    constructor() {
        UserAPI.register(this)
    }

    // MQTT

    create(user: User): void {
        console.log(`User created ${user}`)
        this.userIndex[user.id] = user
        this.addToFindResult(user)
    }

    update(user: User): void {
        console.log(`User updated ${user}`)
        this.removeFromFindResult(user)
        this.addToFindResult(user)
    }

    delete(user: User): void {
        console.log(`User deleted ${user}`)
        this.userIndex[user.id] = user
        this.removeFromFindResult(user)
    }

    // REST

    async checkUser(): Promise<User> {
        // Call backend
        const user = await UserClient.checkUser()
        // Update user index
        this.userIndex[user.id] = user
        // Return user
        return user
    }

    findUsersFromCache() { 
        if (this.findResult) { 
            return Object.keys(this.findResult).map(id => this.userIndex[id])
        } else { 
            return undefined 
        } 
    }

    async findUsers(query?: string, product?: string): Promise<User[]> {
        if (query || product) {
            return await UserClient.findUsers(query, product)
        }
        if (!this.findResult) {
            // Call backend
            const users = await UserClient.findUsers(query, product)
            // Update user index
            for (const user of users) {
                this.userIndex[user.id] = user
            }
            // Update user set
            this.findResult = {}
            for (const user of users) {
                this.findResult[user.id] = true
            }
        }
        // Return users
        return Object.keys(this.findResult).map(id => this.userIndex[id])
    }

    async addUser(data: UserAddData, file?: File): Promise<User> {
        // Call backend
        const user = await UserClient.addUser(data, file)
        // Update user index
        this.userIndex[user.id] = user
        // Update user set
        this.addToFindResult(user)
        // Return user
        return user
    }

    getUserFromCache(userId: string) { 
        if (userId in this.userIndex) { 
            return this.userIndex[userId]
        } else { 
            return undefined 
        } 
    }

    async getUser(id: string): Promise<User> {
        if (!(id in this.userIndex)) {
            // Call backend
            const user = await UserClient.getUser(id)
            // Update user index
            this.userIndex[id] = user
        }
        // Return user
        return this.userIndex[id]
    }

    async updateUser(id: string, data: UserUpdateData, file?: File): Promise<User> {
        // Call backend
        const user = await UserClient.updateUser(id, data, file)
        // Update user index
        this.userIndex[id] = user
        // Update find result
        this.removeFromFindResult(user)
        this.addToFindResult(user)
        // Return user
        return user
    }

    async deleteUser(id: string): Promise<User> {
        // Call backend
        const user = await UserClient.deleteUser(id)
        // Update user index
        this.userIndex[id] = user
        // Update user set
        this.removeFromFindResult(user)
        // Return user
        return user
    }

    private addToFindResult(user: User) {
        if (this.findResult) {
            this.findResult[user.id] = true
        }
    }
    
    private removeFromFindResult(user: User) {
        if (this.findResult) {
            delete this.findResult[user.id]
        }
    }
}

export const UserManager = new UserManagerImpl()