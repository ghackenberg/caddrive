import { User, UserData, UserREST } from 'productboard-common'
import { UserAPI } from '../clients/rest/user'

class UserManagerImpl implements UserREST<UserData, File> {
    async checkUser(): Promise<User> {
        return UserAPI.checkUser()
    }
    async findUsers(): Promise<User[]> {
        return UserAPI.findUsers()
    }
    async addUser(data: UserData, file?: File): Promise<User> {
        return UserAPI.addUser(data, file)
    }
    async getUser(id: string): Promise<User> {
        return UserAPI.getUser(id)
    }
    async updateUser(id: string, data: UserData, file?: File): Promise<User> {
        return UserAPI.updateUser(id, data, file)
    }
    async deleteUser(id: string): Promise<User> {
        return UserAPI.deleteUser(id)
    }
}

export const UserManager = new UserManagerImpl()