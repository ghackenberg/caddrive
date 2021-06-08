import { Injectable } from '@nestjs/common'
import { Audit } from 'fhooe-audit-platform-common'

@Injectable()
export class AuditService {
    private readonly audits: Audit[] = [{id:'test'}]

    async findAll() {
        return this.audits
    }
}