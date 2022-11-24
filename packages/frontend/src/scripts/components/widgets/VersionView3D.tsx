import { Version } from 'productboard-common'
import * as React from 'react'
import { useEffect, useState, Fragment } from 'react'
import { Object3D } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { FileManager } from '../../managers/file'
import { SceneView3D } from './SceneView3D'

import * as LoadIcon from '/src/images/load.png'

export const VersionView3D = (props: { version: Version, mouse: boolean, highlighted?: string[], marked?: string[], selected?: string[], click?: (object: Object3D) => void, vr: boolean}) => {

    // STATES

    const [load, setLoad] = useState<boolean>(true)
    const [path, setPath] = useState<string>('')
    const [file, setFile] = useState<string | ArrayBuffer>(null)
    const [model, setModel] = useState<GLTF>(null)

    // EFFECTS
    
    useEffect(() => { !model && props.version && setLoad(true) }, [props.version])
    useEffect(() => { props.version && setPath(`${props.version.id}.glb`) }, [props.version])
    useEffect(() => { path && FileManager.getFile(path).then(setFile) }, [path])
    useEffect(() => { file && new GLTFLoader().parse(file, path, model => { setModel(model); setLoad(false) }) }, [file])
    
    // RETURN

    return (
        <div className="widget model_view">
            {load ? (
                <img className='load' src={LoadIcon}/>
            ) : (
                <Fragment>               
                    {model && <SceneView3D model={model} mouse={props.mouse} vr={props.vr} highlighted={props.highlighted} marked={props.marked} selected={props.selected} click={props.click}/> }
                </Fragment>
            )}
        </div>
    )
    
}