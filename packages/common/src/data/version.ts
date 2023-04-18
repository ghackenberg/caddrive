import { ApiProperty } from '@nestjs/swagger'

export class VersionUpdateData {
    @ApiProperty()
    major: number
    @ApiProperty()
    minor: number
    @ApiProperty()
    patch: number
    @ApiProperty()
    description: string
}
export class VersionAddData extends VersionUpdateData {
    @ApiProperty()
    userId: string
    @ApiProperty()
    productId: string
    @ApiProperty()
    baseVersionIds: string[]
    @ApiProperty()
    time: string
}

export class Version extends VersionAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
    @ApiProperty()
    modelType: 'glb' | 'ldr' | 'mpd'
    @ApiProperty()
    imageType: 'png'
}
