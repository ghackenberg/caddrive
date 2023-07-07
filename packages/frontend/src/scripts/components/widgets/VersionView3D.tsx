import * as React from 'react'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { FileView3D } from './FileView3D'

export const VersionView3D = (props: { version: Version, mouse: boolean, highlighted?: string[], marked?: string[], selected?: string[], over?: (object: Object3D) => void, out?: (object: Object3D) => void, click?: (object: Object3D) => void }) => {
    return (
        <div className="widget version_view_3d">
            <FileView3D path={`${props.version.versionId}.${props.version.modelType}`} mouse={props.mouse} highlighted={props.highlighted} marked={props.marked} selected={props.selected} over={props.over} out={props.out} click={props.click}/>
        </div>
    )
}