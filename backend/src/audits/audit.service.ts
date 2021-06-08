import { Injectable } from '@nestjs/common'
import { Audit } from 'fhooe-audit-platform-common'

@Injectable()
export class AuditService {
    private readonly audits: Audit[] = []

    async findAll() {
        return this.audits
    }
}