"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTModule = void 0;
var common_1 = require("@nestjs/common");
var audit_module_1 = require("./rest/audits/audit.module");
var product_module_1 = require("./rest/products/product.module");
var user_module_1 = require("./rest/users/user.module");
var RESTModule = /** @class */ (function () {
    function RESTModule() {
    }
    RESTModule = __decorate([
        common_1.Module({
            imports: [user_module_1.UserModule, product_module_1.ProductModule, audit_module_1.AuditModule]
        })
    ], RESTModule);
    return RESTModule;
}());
exports.RESTModule = RESTModule;
