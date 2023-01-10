import * as React from 'react'
import { useEffect, useState } from 'react'

import { Object3D } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { Version } from 'productboard-common'

import { FileManager } from '../../managers/file'
import { SceneView3D } from './SceneView3D'

import * as LoadIcon from '/src/images/load.png'

const LOADER = new GLTFLoader()

const CACHE: {[path: string]: GLTF} = {}

function getModelFromCache(path: string) {
    if (path in CACHE) {
        return CACHE[path]
    } else {
        return undefined
    }
}
async function getModel(path: string) {
    if (path in CACHE) {
        return CACHE[path]
    } else {
        const file = await FileManager.getFile(path)
        return new Promise<GLTF>((resolve, reject) => {
            LOADER.parse(file, path, model => {
                CACHE[path] = model
                resolve(model)
            }, reject)
        })
    }
}

export const VersionView3D = (props: { version: Version, mouse: boolean, highlighted?: string[], marked?: string[], selected?: string[], click?: (object: Object3D) => void, vr: boolean}) => {

    // INITIAL STATES

    const initialPath = props.version && `${props.version.id}.glb`
    const initialModel = initialPath && getModelFromCache(initialPath)

    // STATES

    const [load, setLoad] = useState<boolean>(!initialModel)

    const [path, setPath] = useState<string>(initialPath)
    const [model, setModel] = useState<GLTF>(initialModel)

    // EFFECTS
    
    useEffect(() => { !model && props.version && setLoad(true) }, [props.version])
    useEffect(() => { props.version && setPath(`${props.version.id}.glb`) }, [props.version])
    useEffect(() => { path && getModel(path).then(setModel).then(() => setLoad(false)) }, [path])
    
    // RETURN

    return (
        <div className="widget model_view">
            {load ? (
                <img className='load' src={LoadIcon}/>
            ) : (
                <>               
                    {model && (
                        <SceneView3D model={model} mouse={props.mouse} vr={props.vr} highlighted={props.highlighted} marked={props.marked} selected={props.selected} click={props.click}/>
                    )}
                </>
            )}
        </div>
    )
    
}