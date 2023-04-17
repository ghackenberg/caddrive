import * as React from 'react'
import { useEffect, useState } from 'react'

import { Object3D } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { FileManager } from '../../managers/file'
import { ModelView3D } from './ModelView3D'

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

export const FileView3D = (props: { path: string, mouse: boolean, highlighted?: string[], marked?: string[], selected?: string[], click?: (object: Object3D) => void, vr: boolean }) => {

    // INITIAL STATES

    const initialModel = getModelFromCache(props.path)

    // STATES

    const [model, setModel] = useState<GLTF>(initialModel)

    // EFFECTS
    
    useEffect(() => {
        if (props.path) {
            const initialModel = getModelFromCache(props.path)
            setModel(initialModel)
            if (!initialModel) {
                getModel(props.path).then(setModel)
            }
        } else {
            setModel(undefined)
        }
    }, [props.path])
    
    // RETURN

    return (
        <div className="widget file_view_3d">
            {model ? (
                <ModelView3D model={model.scene} mouse={props.mouse} vr={props.vr} highlighted={props.highlighted} marked={props.marked} selected={props.selected} click={props.click}/>
            ) : (
                <img src={LoadIcon} className='icon medium position center animation spin'/>
            )}
        </div>
    )
    
}