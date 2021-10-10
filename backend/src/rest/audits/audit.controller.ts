import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Audit, AuditData, AuditREST } from 'fhooe-audit-platform-common'
import { AuditService } from './audit.service'

@Controller('rest/audits')
export class AuditController implements AuditREST {
    constructor(private auditService: AuditService) {
        
    }

    @Get()
    @ApiQuery({ name: 'quick' })
    @ApiQuery({ name: 'name' })
    @ApiQuery({ name: 'product' })
    @ApiQuery({ name: 'version' })
    @ApiResponse({ type: [Audit] })
    async findAudits(@Query('quick') quick?:string, @Query('name') name?: string, @Query('product') product?: string, @Query('version') version?: string): Promise<Audit[]> {
        return this.auditService.findAudits(quick, name, product, version)
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