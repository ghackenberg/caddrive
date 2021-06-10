import * as React from 'react'
import { useEffect, useState } from 'react'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { NodeItem } from './NodeItem'

export const SceneGraph = (props: { url: string }) => {
    const [model, setModel] = useState<GLTF>(null)
    useEffect(() => { new GLTFLoader().loadAsync(props.url).then(setModel) }, [])
    return (
        <React.Fragment>
            <h2>{props.url}</h2>
            <ul>
                {model && <NodeItem object={model.scene}/>}
            </ul>
        </React.Fragment>
    )
}