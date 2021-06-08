import { Injectable } from '@nestjs/common'
import { User } from 'fhooe-audit-platform-common'

@Injectable()
export class UserService {
  private readonly users: User[] = []

  async findAll() {
      return this.users
  }
}