import { Injectable } from '@nestjs/common'
import * as shortid from 'shortid'
import { Audit, AuditREST } from 'fhooe-audit-platform-common'

@Injectable()
export class AuditService implements AuditREST {
    private readonly audits: Audit[] = []

    constructor() {
        for (var i = 0; i < Math.random() * 20; i++) {
            this.audits.push({
                id: shortid()
            })
        }
    }

    async findAll() {
        return this.audits
    }
    
    async addAudit(audit: Audit) {
        this.audits.push(audit)
        
        return audit
    }

    async updateAudit(audit: Audit) {
        
        for (var i = 0; i < this.audits.length; i++) {
            if (this.audits[i].id == audit.id)
                this.audits.splice(i,1,audit)
        }

        return audit
    }
}