import * as React from 'react'

import { Object3D } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

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

const NodeItem = (props: { object: Object3D, click?: (object: Object3D) => void }) => (
    <div>
        <a onClick={() => props.click && props.click(props.object)}>
            <img src={icons[props.object.type]}/>
            {props.object.name || 'Anonymous'}
        </a>
        <NodeList list={props.object.children} click={props.click}/>
    </div>
)

const NodeList = (props: { list: Object3D[], click?: (object: Object3D) => void }) => (
    <div>
        <ul>
            {props.list.map((child, index) => (
                <li key={index}>
                    <NodeItem object={child} click={props.click}/>
                </li>
            ))}
        </ul>
    </div>
)

export const ModelGraph = (props: { model: GLTF, click?: (object: Object3D) => void }) => (
    <div className="widget model_graph">
        <NodeItem object={props.model.scene} click={props.click}/>
    </div>
)