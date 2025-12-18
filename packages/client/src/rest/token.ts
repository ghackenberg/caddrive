import axios from "axios"

import { TokenActivateRequest, TokenActivateResponse, TokenCreateRequest, TokenCreateResponse, TokenREST, TokenRefreshResponse } from "productboard-common"

import { auth } from "../auth"

class TokenClientImpl implements TokenREST {
    async createToken(request: TokenCreateRequest): Promise<TokenCreateResponse> {
        return (await axios.post<TokenCreateResponse>('/rest/tokens', request)).data
    }
    async activateToken(tokenId: string, request: TokenActivateRequest): Promise<TokenActivateResponse> {
        return (await axios.put<TokenActivateResponse>(`/rest/tokens/${tokenId}`, request)).data
    }
    async refreshToken(): Promise<TokenRefreshResponse> {
        return (await axios.patch<TokenRefreshResponse>('/rest/tokens', null, auth)).data
    }
}

export const TokenClient = new TokenClientImpl()