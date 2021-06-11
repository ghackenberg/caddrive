import * as React from 'react'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { NodeItem } from './NodeItem'

export const SceneGraph = (props: { model: GLTF }) => {
    return (
        <div className="widget scene_graph">
            <NodeItem object={props.model.scene}/>
        </div>
    )
}