import { User, UserData, UserREST } from 'productboard-common'
import { UserClient } from '../clients/rest/user'

class UserManagerImpl implements UserREST<UserData, File> {
    async checkUser(): Promise<User> {
        return UserClient.checkUser()
    }
    async findUsers(): Promise<User[]> {
        return UserClient.findUsers()
    }
    async addUser(data: UserData, file?: File): Promise<User> {
        return UserClient.addUser(data, file)
    }
    async getUser(id: string): Promise<User> {
        return UserClient.getUser(id)
    }
    async updateUser(id: string, data: UserData, file?: File): Promise<User> {
        return UserClient.updateUser(id, data, file)
    }
    async deleteUser(id: string): Promise<User> {
        return UserClient.deleteUser(id)
    }
}

export const UserManager = new UserManagerImpl()