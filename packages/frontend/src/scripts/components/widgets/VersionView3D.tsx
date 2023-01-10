import * as React from 'react'

import { Object3D } from 'three'

import { Version } from 'productboard-common'

import { FileView3D } from './FileView3D'

export const VersionView3D = (props: { version: Version, mouse: boolean, highlighted?: string[], marked?: string[], selected?: string[], click?: (object: Object3D) => void, vr: boolean }) => {
    return (
        <FileView3D path={`${props.version.id}.glb`} mouse={props.mouse} highlighted={props.highlighted} marked={props.marked} selected={props.selected} click={props.click} vr={props.vr}/>
    )
}