import { ApiProperty } from '@nestjs/swagger'

export class UserUpdateData {
    @ApiProperty()
    email: string
    @ApiProperty()
    name: string
    @ApiProperty()
    password: string
}

export class UserAddData extends UserUpdateData {
    
}

export class User extends UserAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
    @ApiProperty()
    pictureId: string
}

