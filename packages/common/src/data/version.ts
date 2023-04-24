import { ApiProperty } from '@nestjs/swagger'

export type ModelType = 'glb' | 'ldr' | 'mpd'

export type ImageType = 'png' | null

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
    productId: string
    @ApiProperty()
    baseVersionIds: string[]
}

export class Version extends VersionAddData {
    @ApiProperty()
    id: string
    @ApiProperty()
    deleted: boolean
    @ApiProperty()
    userId: string
    @ApiProperty()
    time: string
    @ApiProperty()
    modelType: ModelType
    @ApiProperty()
    imageType: ImageType
}
