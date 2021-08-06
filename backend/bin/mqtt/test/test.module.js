"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModule = void 0;
var common_1 = require("@nestjs/common");
var test_controller_1 = require("./test.controller");
var TestModule = /** @class */ (function () {
    function TestModule() {
    }
    TestModule = __decorate([
        common_1.Module({
            controllers: [test_controller_1.TestController]
        })
    ], TestModule);
    return TestModule;
}());
exports.TestModule = TestModule;
