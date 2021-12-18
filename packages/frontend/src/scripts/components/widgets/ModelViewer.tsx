import * as React from 'react'
import { useEffect, useState } from 'react'
import { Object3D } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// Widgets
import { SceneGraph } from './SceneGraph'
import { SceneView } from './SceneView'

export const ModelViewer = (props: { url: string, highlighted?: string[], selected?: string[], click?: (object: Object3D) => void }) => {

    const [model, setModel] = useState<GLTF>(null)
    
    // TODO: use auth!
    useEffect(() => { new GLTFLoader().loadAsync(props.url).then(setModel) }, [props.url])

    return (
        <div className="widget model_viewer">
            {model && (
                <React.Fragment>
                    <SceneGraph model={model} click={props.click}/>
                    <SceneView model={model} mouse={true} vr={true} highlighted={props.highlighted} selected={props.selected} click={props.click}/>
                </React.Fragment>
            )}
        </div>
    )
    
}