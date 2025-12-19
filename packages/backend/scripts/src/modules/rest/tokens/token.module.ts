import { Module } from "@nestjs/common"
import { TokenController } from "./token.controller.js"
import { TokenOptionalGuard, TokenRequiredGuard } from "./token.guard.js"
import { TokenService } from "./token.service.js"

@Module({
    controllers: [TokenController],
    providers: [TokenRequiredGuard, TokenOptionalGuard, TokenService],
    exports: [TokenRequiredGuard, TokenOptionalGuard]
})
export class TokenModule {}