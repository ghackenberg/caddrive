import { Module } from "@nestjs/common"

import { TokenController } from "./token.controller"
import { TokenOptionalGuard, TokenRequiredGuard } from "./token.guard"
import { TokenService } from "./token.service"

@Module({
    controllers: [TokenController],
    providers: [TokenRequiredGuard, TokenOptionalGuard, TokenService],
    exports: [TokenRequiredGuard, TokenOptionalGuard]
})
export class TokenModule {}