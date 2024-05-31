import { ApiProperty } from '@nestjs/swagger'

export type ModelType = 'glb' | 'ldr' | 'mpd'

export type ImageType = 'png' | null

export class VersionUpdate {
    @ApiProperty()
    baseVersionIds: string[]
    
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
}

export class VersionRead extends VersionCreate {
    @ApiProperty()
    userId: string
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
    modelType: ModelType
    @ApiProperty()
    imageType: ImageType
}
