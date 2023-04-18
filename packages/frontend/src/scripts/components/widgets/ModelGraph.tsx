import * as React from 'react'

import { Group, Object3D } from 'three'

import * as ObjectIcon from '/src/images/types/Object.png'
import * as GroupIcon from '/src/images/types/Group.png'
import * as LineIcon from '/src/images/types/Line.png'
import * as MeshIcon from '/src/images/types/Mesh.png'
import * as BoneIcon from '/src/images/types/Bone.png'
import * as CameraIcon from '/src/images/types/Camera.png'

const icons: {[key: string]: string} = {
    Object3D: ObjectIcon,
    Group: GroupIcon,
    LineSegments: LineIcon,
    Mesh: MeshIcon,
    SkinnedMesh: MeshIcon,
    Bone: BoneIcon,
    PerspectiveCamera: CameraIcon
}

const NodeItem = (props: { path: string, object: Object3D, highlighted: string[], marked: string[], selected: string[], over?: (object: Object3D) => void, out?: (object: Object3D) => void, click?: (object: Object3D) => void }) => {
    const path = props.path
    const object = props.object

    const over = props.over || function() {/*empty*/}
    const out = props.out || function() {/*empty*/}
    const click = props.click || function() {/*empty*/}

    const highlighted = props.highlighted.filter(prefix => path.startsWith(prefix)).length != 0
    const marked = props.marked.filter(prefix => path.startsWith(prefix)).length != 0
    const selected = props.selected.filter(prefix => path.startsWith(prefix)).length != 0

    const classes = [highlighted && 'highlighted', marked && 'marked', selected && 'selected'].filter(v => !!v).join(' ')

    return (
        <div>
            <a onMouseOver={() => over(object)} onMouseOut={() => out(object)} onClick={() => click(object)} className={classes}>
                <img src={icons[object.type]} className='icon small'/>
                {object.name ? (
                    <span>{object.name}</span>
                ) : (
                    <em>Anonymous</em>
                )}
            </a>
            <NodeList path={path} list={props.object.children} highlighted={props.highlighted} marked={props.marked} selected={props.selected} over={props.over} out={props.out} click={props.click}/>
        </div>
    )
}

const NodeList = (props: { path: string, list: Object3D[], highlighted: string[], marked: string[], selected: string[], over?: (object: Object3D) => void, out?: (object: Object3D) => void, click?: (object: Object3D) => void }) => {
    const path = props.path
    return (
        <div>
            <ul>
                {props.list.map((child, index) => (
                    <li key={index}>
                        <NodeItem path={`${path}-${index}`} object={child} highlighted={props.highlighted} marked={props.marked} selected={props.selected} over={props.over} out={props.out} click={props.click}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export const ModelGraph = (props: { model: Group, highlighted: string[], marked: string[], selected: string[], over?: (object: Object3D) => void, out?: (object: Object3D) => void, click?: (object: Object3D) => void }) => {
    return (
        <div className="widget model_graph">
            <NodeItem path='0' object={props.model} highlighted={props.highlighted} marked={props.marked} selected={props.selected} over={props.over} out={props.out} click={props.click}/>
        </div>
    )
}