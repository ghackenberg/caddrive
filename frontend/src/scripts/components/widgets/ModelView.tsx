import * as React from 'react'
import { useEffect, useState } from 'react'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// Widgets
import { SceneView } from './SceneView'

export const ModelView = (props: { url: string }) => {

    const [model, setModel] = useState<GLTF>(null)
    
    // TODO: use auth!
    useEffect(() => { new GLTFLoader().loadAsync(props.url).then(setModel) }, [props.url])

    return (
        <div className="widget model_view">
            {model && <SceneView model={model} vr={false}/> }
        </div>
    )
    
}