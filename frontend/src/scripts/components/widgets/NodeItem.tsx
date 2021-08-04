import * as React from 'react'
import { Link } from 'react-router-dom'
import { Object3D } from 'three'
import { NodeList } from './NodeList'
import * as BoneIcon from '/src/images/types/Bone.png'
import * as GroupIcon from '/src/images/types/Group.png'
import * as MeshIcon from '/src/images/types/Mesh.png'
import * as Object3DIcon from '/src/images/types/Object3D.png'
import * as PerspectiveCameraIcon from '/src/images/types/PerspectiveCamera.png'
import * as SkinnedMeshIcon from '/src/images/types/SkinnedMesh.png'

const icons = {
    Bone: BoneIcon,
    Group: GroupIcon,
    Mesh: MeshIcon,
    Object3D: Object3DIcon,
    PerspectiveCamera: PerspectiveCameraIcon,
    SkinnedMesh: SkinnedMeshIcon
}

export const NodeItem = (props: { object: Object3D }) => (
    <div className="widget node_item">
        <Link to="#">
            <img src={icons[props.object.type]}/>
            {props.object.name || 'Anonymous'}
        </Link>
        <NodeList list={props.object.children}/>
    </div>
)