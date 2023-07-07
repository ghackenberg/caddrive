import { ApiProperty } from '@nestjs/swagger'

export class UserUpdateData {
    @ApiProperty()
    consent: boolean
    @ApiProperty()
    name: string
}

export class User extends UserUpdateData {
    @ApiProperty()
    userId: string
    
    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number

    @ApiProperty()
    email: string

    @ApiProperty()
    pictureId: string
}