import * as React from 'react'

import { Object3D } from 'three'

import { VersionRead } from 'productboard-common'

import { FileView3D } from './FileView3D'

export const VersionView3D = (props: { version: VersionRead, mouse: boolean, highlighted?: string[], marked?: string[], selected?: string[], over?: (object: Object3D) => void, out?: (object: Object3D) => void, click?: (object: Object3D) => void }) => {
    const version = props.version
    const versionId = version.versionId
    const modelType = version.modelType
    const path = modelType == 'ldr' ? `${versionId}.ldr` : `${versionId}.${modelType}`
    return (
        <div className="widget version_view_3d">
            <FileView3D path={path} mouse={props.mouse} highlighted={props.highlighted} marked={props.marked} selected={props.selected} over={props.over} out={props.out} click={props.click}/>
        </div>
    )
}