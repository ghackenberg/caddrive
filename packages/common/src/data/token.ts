import { ApiProperty } from "@nestjs/swagger"

// Create token

export class CreateTokenRequest {
    @ApiProperty()
    email: string
}
export class CreateTokenResponse {
    @ApiProperty()
    tokenId: string
}

// Activate token

export class ActivateTokenRequest {
    @ApiProperty()
    code: string
}
export class ActivateTokenResponse {
    @ApiProperty()
    jwt: string
}

// Refresh token

export class RefreshTokenResponse {
    @ApiProperty()
    jwt: string
}