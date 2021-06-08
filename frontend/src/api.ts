import axios from 'axios'
import { Audit, Product, User } from 'fhooe-audit-platform-common'

export class UserAPI {
    static async findAll() {
        return (await axios.get<User[]>('/api/users')).data
    }
}

export class ProductAPI {
    static async findAll() {
        return (await axios.get<Product[]>('/api/products')).data
    }
}

export class AuditAPI {
    static async findAll() {
        return (await axios.get<Audit[]>('/api/audits')).data
    }
}