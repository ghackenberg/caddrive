import { ApiProperty } from '@nestjs/swagger'

export class UserUpdateData {

}

export class UserAddData extends UserUpdateData {
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
    @ApiProperty()
    password: string
}

export class User extends UserAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
}
