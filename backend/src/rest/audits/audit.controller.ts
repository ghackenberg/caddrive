import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { ApiBody, ApiResponse } from '@nestjs/swagger'
import { Audit, AuditREST } from 'fhooe-audit-platform-common'
import { AuditService } from './audit.service'

@Controller('rest/audits')
export class AuditController implements AuditREST {
    constructor(private auditService: AuditService) {

    }

    @Get()
    @ApiResponse({ type: [Audit] })
    async findAll(): Promise<Audit[]> {
        return this.auditService.findAll()
    }

    @Post() 
    @ApiBody({ type: Audit })
    @ApiResponse({ type: Audit })
    async addAudit(@Body() audit: Audit): Promise<Audit> {
        return this.auditService.addAudit(audit)
    }

    @Put()
    @ApiBody({ type: Audit })
    @ApiResponse({ type: Audit })
    async updateAudit(@Body() audit: Audit): Promise<Audit> {
        return this.auditService.updateAudit(audit)
    }
}