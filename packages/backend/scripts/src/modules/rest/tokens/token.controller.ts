import { Body, Controller, Param, Patch, Post, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from "@nestjs/swagger"

import { TokenActivateRequest, TokenActivateResponse, TokenCreateRequest, TokenCreateResponse, TokenREST, TokenRefreshResponse } from "productboard-common"

import { TokenRequiredGuard } from "./token.guard"
import { TokenService } from "./token.service"

@Controller('rest/tokens')
export class TokenController implements TokenREST {
    constructor(
        private readonly tokenService: TokenService
    ) {}

    @Post()
    @ApiBody({ type: TokenCreateRequest })
    @ApiResponse({ type: TokenCreateResponse })
    async createToken(
        @Body() request: TokenCreateRequest
    ): Promise<TokenCreateResponse> {
        return this.tokenService.createToken(request)
    }
    
    @Put(':tokenId')
    @ApiParam({ name: 'tokenId', type: 'string' })
    @ApiBody({ type: TokenActivateRequest })
    @ApiResponse({ type: TokenActivateResponse })
    async activateToken(
        @Param('tokenId') tokenId: string,
        @Body() request: TokenActivateRequest
    ): Promise<TokenActivateResponse> {
        return this.tokenService.activateToken(tokenId, request)
    }

    @UseGuards(TokenRequiredGuard)
    @Patch()
    @ApiBearerAuth()
    @ApiResponse({ type: TokenRefreshResponse })
    async refreshToken(): Promise<TokenRefreshResponse> {
        return this.tokenService.refreshToken()
    }
}