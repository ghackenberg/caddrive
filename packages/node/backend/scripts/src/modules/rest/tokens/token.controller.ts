import { Body, Controller, Param, Patch, Post, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from "@nestjs/swagger"

import { ActivateTokenRequest, ActivateTokenResponse, CreateTokenRequest, CreateTokenResponse, RefreshTokenResponse, TokenREST } from "productboard-common"

import { TokenRequiredGuard } from "./token.guard"
import { TokenService } from "./token.service"

@Controller('rest/tokens')
export class TokenController implements TokenREST {
    constructor(
        private readonly tokenService: TokenService
    ) {}

    @Post()
    @ApiBody({ type: CreateTokenRequest })
    @ApiResponse({ type: CreateTokenResponse })
    async createToken(
        @Body() request: CreateTokenRequest
    ): Promise<CreateTokenResponse> {
        return this.tokenService.createToken(request)
    }
    
    @Put(':tokenId')
    @ApiParam({ name: 'tokenId', type: 'string' })
    @ApiBody({ type: ActivateTokenRequest })
    @ApiResponse({ type: ActivateTokenResponse })
    async activateToken(
        @Param('tokenId') tokenId: string,
        @Body() request: ActivateTokenRequest
    ): Promise<ActivateTokenResponse> {
        return this.tokenService.activateToken(tokenId, request)
    }

    @UseGuards(TokenRequiredGuard)
    @Patch()
    @ApiBearerAuth()
    @ApiResponse({ type: RefreshTokenResponse })
    async refreshToken(): Promise<RefreshTokenResponse> {
        return this.tokenService.refreshToken()
    }
}