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
exports.__esModule = true;
exports.Audit = exports.Product = exports.User = void 0;
var swagger_1 = require("@nestjs/swagger");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        swagger_1.ApiProperty(),
        __metadata("design:type", String)
    ], User.prototype, "id");
    __decorate([
        swagger_1.ApiProperty(),
        __metadata("design:type", String)
    ], User.prototype, "email");
    return User;
}());
exports.User = User;
var Product = /** @class */ (function () {
    function Product() {
    }
    __decorate([
        swagger_1.ApiProperty(),
        __metadata("design:type", String)
    ], Product.prototype, "id");
    return Product;
}());
exports.Product = Product;
var Audit = /** @class */ (function () {
    function Audit() {
    }
    __decorate([
        swagger_1.ApiProperty(),
        __metadata("design:type", String)
    ], Audit.prototype, "id");
    return Audit;
}());
exports.Audit = Audit;
