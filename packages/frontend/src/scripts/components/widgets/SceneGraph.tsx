import * as React from 'react'
import { Object3D } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
// Widgets
import { NodeItem } from './NodeItem'

export const SceneGraph = (props: { model: GLTF, click?: (object: Object3D) => void }) => (
    <div className="widget scene_graph">
        <NodeItem object={props.model.scene} click={props.click}/>
    </div>
)