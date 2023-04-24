import { ApiProperty } from '@nestjs/swagger'

export class UserUpdateData {
    @ApiProperty()
    email: string
    @ApiProperty()
    name: string
}

export class UserAddData extends UserUpdateData {
    
}

export class User extends UserAddData {
    @ApiProperty()
    id: string
    
    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number

    @ApiProperty()
    pictureId: string
}