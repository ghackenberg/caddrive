import { ApiProperty } from '@nestjs/swagger'

export class UserUpdate {
    @ApiProperty()
    consent: boolean
    @ApiProperty()
    name: string
    @ApiProperty()
    emailNotification: boolean
}

export class UserCreate extends UserUpdate {

}

export class UserRead extends UserCreate {
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