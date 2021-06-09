import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Audit, AuditREST } from 'fhooe-audit-platform-common'
import { AuditService } from './audit.service'

@Controller('rest/audits')
export class AuditController implements AuditREST {
    constructor(private auditService: AuditService) {

    }

    @Get()
    @ApiResponse({ type: [Audit] })
    findAll() {
        return this.auditService.findAll()
    }
}