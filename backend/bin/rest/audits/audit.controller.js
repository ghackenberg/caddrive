"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var fhooe_audit_platform_common_1 = require("fhooe-audit-platform-common");
var audit_service_1 = require("./audit.service");
var AuditController = /** @class */ (function () {
    function AuditController(auditService) {
        this.auditService = auditService;
    }
    AuditController.prototype.findAll = function () {
        return this.auditService.findAll();
    };
    __decorate([
        common_1.Get(),
        swagger_1.ApiResponse({ type: [fhooe_audit_platform_common_1.Audit] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AuditController.prototype, "findAll", null);
    AuditController = __decorate([
        common_1.Controller('rest/audits'),
        __metadata("design:paramtypes", [audit_service_1.AuditService])
    ], AuditController);
    return AuditController;
}());
exports.AuditController = AuditController;
