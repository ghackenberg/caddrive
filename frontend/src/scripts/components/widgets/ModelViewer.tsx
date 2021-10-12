import * as React from 'react'
import { useEffect, useState } from 'react'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// Widgets
import { SceneGraph } from './SceneGraph'
import { SceneView } from './SceneView'

export const ModelViewer = (props: { url: string }) => {

    const [model, setModel] = useState<GLTF>(null)
    
    useEffect(() => { new GLTFLoader().loadAsync(props.url).then(setModel) }, [props.url])

    return (
        <div className="widget model_viewer">
            {model && (
                <React.Fragment>
                    <SceneGraph model={model}/>
                    <SceneView model={model}/>
                </React.Fragment>
            )}
        </div>
    )
    
}