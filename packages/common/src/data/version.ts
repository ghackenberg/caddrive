import { ApiProperty } from '@nestjs/swagger'

export type ModelType = 'glb' | 'ldr' | 'mpd'

export type ImageType = 'png' | null

export class VersionUpdate {
    @ApiProperty()
    major: number
    @ApiProperty()
    minor: number
    @ApiProperty()
    patch: number
    
    @ApiProperty()
    description: string
}
export class VersionCreate extends VersionUpdate {
    @ApiProperty()
    baseVersionIds: string[]
}

export class VersionRead extends VersionCreate {
    @ApiProperty()
    productId: string
    @ApiProperty()
    versionId: string

    @ApiProperty()
    created: number
    @ApiProperty()
    updated: number
    @ApiProperty()
    deleted: number

    @ApiProperty()
    userId: string
    
    @ApiProperty()
    modelType: ModelType
    @ApiProperty()
    imageType: ImageType
}
