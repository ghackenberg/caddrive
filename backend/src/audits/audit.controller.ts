import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Audit } from 'fhooe-audit-platform-common'
import { AuditService } from './audit.service'

@Controller('api/audits')
export class AuditController {
    constructor(private auditService: AuditService) {

    }

    @Get()
    @ApiResponse({ type: [Audit] })
    findAll() {
        return this.auditService.findAll()
    }
}