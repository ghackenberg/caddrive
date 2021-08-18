import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { Audit, AuditData, AuditREST } from 'fhooe-audit-platform-common'
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

    @Get(':id')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: Audit })
    async getAudit(@Param('id') id: string): Promise<Audit> {
        return this.auditService.getAudit(id)
    }

    @Post() 
    @ApiBody({ type: AuditData })
    @ApiResponse({ type: Audit })
    async addAudit(@Body() audit: AuditData): Promise<Audit> {
        return this.auditService.addAudit(audit)
    }

    @Put()
    @ApiBody({ type: Audit })
    @ApiResponse({ type: Audit })
    async updateAudit(@Body() audit: Audit): Promise<Audit> {
        return this.auditService.updateAudit(audit)
    }
}