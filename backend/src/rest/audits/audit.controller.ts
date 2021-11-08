import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBasicAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Audit, AuditData, AuditREST } from 'fhooe-audit-platform-common'
import { AuditService } from './audit.service'

@Controller('rest/audits')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
export class AuditController implements AuditREST {
    constructor(
        private readonly auditService: AuditService
    ) {}

    @Get()
    @ApiQuery({ name: 'quick', type: 'string', required: false })
    @ApiQuery({ name: 'name', type: 'string', required: false })
    @ApiQuery({ name: 'product', type: 'string', required: false })
    @ApiQuery({ name: 'version', type: 'string', required: false })
    @ApiResponse({ type: [Audit] })
    async findAudits(
        @Query('quick') quick?:string,
        @Query('name') name?: string,
        @Query('product') productId?: string,
        @Query('version') versionId?: string
    ): Promise<Audit[]> {
        return this.auditService.findAudits(quick, name, productId, versionId)
    }

    @Post()
    @ApiBody({ type: AuditData, required: true })
    @ApiResponse({ type: Audit })
    async addAudit(
        @Body() data: AuditData
    ): Promise<Audit> {
        return this.auditService.addAudit(data)
    }  

    @Get(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: Audit })
    async getAudit(
        @Param('id') id: string
    ): Promise<Audit> {
        return this.auditService.getAudit(id)
    } 

    @Put(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiBody({ type: Audit, required: true })
    @ApiResponse({ type: Audit })
    async updateAudit(
        @Param('id') id: string,
        @Body() data: AuditData
    ): Promise<Audit> {
        return this.auditService.updateAudit(id, data)
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: 'string', required: true })
    @ApiResponse({ type: [Audit] })
    async deleteAudit(
        @Param('id') id: string
    ): Promise<Audit> {
        return this.auditService.deleteAudit(id)
    } 
}