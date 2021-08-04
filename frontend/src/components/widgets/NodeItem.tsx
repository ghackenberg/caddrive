import * as React from 'react'
import { Link } from 'react-router-dom'
import { Object3D } from 'three'
import { NodeList } from './NodeList'
import * as BoneIcon from '/assets/images/types/Bone.png'
import * as GroupIcon from '/assets/images/types/Group.png'
import * as MeshIcon from '/assets/images/types/Mesh.png'
import * as Object3DIcon from '/assets/images/types/Object3D.png'
import * as PerspectiveCameraIcon from '/assets/images/types/PerspectiveCamera.png'
import * as SkinnedMeshIcon from '/assets/images/types/SkinnedMesh.png'

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