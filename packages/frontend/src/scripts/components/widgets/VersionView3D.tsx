import * as React from 'react'
import { useEffect, useState, Fragment } from 'react'
import { Object3D } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// Commons
import { Version } from 'productboard-common'
// Widgets
import { SceneView } from './SceneView'
// Images
import * as LoadIcon from '/src/images/load.png'
import { FileManager } from '../../managers/file'

export const VersionView3D = (props: { version: Version, mouse: boolean, highlighted?: string[], selected?: string[], click?: (object: Object3D) => void }) => {

    const [load, setLoad] = useState<boolean>(true)
    const [path, setPath] = useState<string>('')
    const [file, setFile] = useState<string | ArrayBuffer>(null)
    const [model, setModel] = useState<GLTF>(null)
    
    useEffect(() => { props.version && setLoad(true) }, [props.version])
    useEffect(() => { props.version && setPath(`${props.version.id}.glb`) }, [props.version])
    useEffect(() => { path && FileManager.getFile(path).then(setFile) }, [path])
    useEffect(() => { file && new GLTFLoader().parse(file, path, model => { setModel(model); setLoad(false) }) }, [file])

    return (
        <div className="widget model_view">
            {load ? (
                <img className='load' src={LoadIcon}/>
            ) : (
                <Fragment>
                    {model && <SceneView model={model} mouse={props.mouse} vr={false} highlighted={props.highlighted} selected={props.selected} click={props.click}/> }
                </Fragment>
            )}
        </div>
    )
    
}