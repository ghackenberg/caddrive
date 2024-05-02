import { ApiProperty } from "@nestjs/swagger"

// Create token

export class TokenCreateRequest {
    @ApiProperty()
    email: string
}
export class TokenCreateResponse {
    @ApiProperty()
    tokenId: string
}

// Activate token

export class TokenActivateRequest {
    @ApiProperty()
    code: string
}
export class TokenActivateResponse {
    @ApiProperty()
    jwt: string
}

// Refresh token

export class TokenRefreshResponse {
    @ApiProperty()
    jwt: string
}