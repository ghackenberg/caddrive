import * as React from 'react'
import { useEffect, useState, Fragment } from 'react'
import { Object3D } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// Widgets
import { SceneView } from './SceneView'
// Images
import * as LoadIcon from '/src/images/load.png'

export const ModelView = (props: { url: string, mouse: boolean, click?: (object: Object3D) => void }) => {

    const [load, setLoad] = useState<boolean>(true)
    const [model, setModel] = useState<GLTF>(null)
    
    // TODO: use auth!
    useEffect(() => { new GLTFLoader().loadAsync(props.url).then(setModel).then(() => setLoad(false)) }, [props])

    return (
        <div className="widget model_view">
            {load ? (
                <img className='load' src={LoadIcon}/>
            ) : (
                <Fragment>
                    {model && <SceneView model={model} mouse={props.mouse} vr={false} click={props.click}/> }
                </Fragment>
            )}
        </div>
    )
    
}