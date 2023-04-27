import axios from "axios"

import { ActivateTokenRequest, ActivateTokenResponse, CreateTokenRequest, CreateTokenResponse, RefreshTokenResponse, TokenREST } from "productboard-common"

import { auth } from "../auth"

class TokenClientImpl implements TokenREST {
    async createToken(request: CreateTokenRequest): Promise<CreateTokenResponse> {
        return (await axios.post<CreateTokenResponse>('/rest/tokens', request)).data
    }
    async activateToken(id: string, request: ActivateTokenRequest): Promise<ActivateTokenResponse> {
        return (await axios.put<ActivateTokenResponse>(`/rest/tokens/${id}`, request)).data
    }
    async refreshToken(): Promise<RefreshTokenResponse> {
        return (await axios.patch<RefreshTokenResponse>('/rest/tokens', null, { ...auth })).data
    }
}

export const TokenClient = new TokenClientImpl()