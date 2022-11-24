import * as React from 'react'
import { Object3D } from 'three'

import { NodeList } from './NodeList'

import * as BoneIcon from '/src/images/types/Bone.png'
import * as GroupIcon from '/src/images/types/Group.png'
import * as MeshIcon from '/src/images/types/Mesh.png'
import * as Object3DIcon from '/src/images/types/Object3D.png'
import * as PerspectiveCameraIcon from '/src/images/types/PerspectiveCamera.png'
import * as SkinnedMeshIcon from '/src/images/types/SkinnedMesh.png'

const icons: {[key: string]: string} = {
    Bone: BoneIcon,
    Group: GroupIcon,
    Mesh: MeshIcon,
    Object3D: Object3DIcon,
    PerspectiveCamera: PerspectiveCameraIcon,
    SkinnedMesh: SkinnedMeshIcon
}

export const NodeItem = (props: { object: Object3D, click?: (object: Object3D) => void }) => (
    <div className="widget node_item">
        <a onClick={() => props.click && props.click(props.object)}>
            <img src={icons[props.object.type]}/>
            {props.object.name || 'Anonymous'}
        </a>
        <NodeList list={props.object.children} click={props.click}/>
    </div>
)