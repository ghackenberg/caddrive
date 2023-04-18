import * as React from 'react'
import { useEffect, useState } from 'react'

import { Group, Object3D } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { loadGLTFModel } from '../../loaders/gltf'
import { loadLDrawModel } from '../../loaders/ldraw'
import { ModelGraph } from './ModelGraph'
import { ModelView3D } from './ModelView3D'

import * as LoadIcon from '/src/images/load.png'

const GLTF_MODEL_CACHE: {[path: string]: GLTF} = {}
const LDRAW_MODEL_CACHE: {[path: string]: Group} = {}

async function getGLTFModel(path: string) {
    if (!(path in GLTF_MODEL_CACHE)) {
        GLTF_MODEL_CACHE[path] = await loadGLTFModel(path)
    }
    return GLTF_MODEL_CACHE[path]

}

async function getLDrawModel(path: string) {
    if (!(path in LDRAW_MODEL_CACHE)) {
        LDRAW_MODEL_CACHE[path] = await loadLDrawModel(path)
    }
    return LDRAW_MODEL_CACHE[path]
}

export const FileView3D = (props: { path: string, mouse: boolean, highlighted?: string[], marked?: string[], selected?: string[], over?: (object: Object3D) => void, out?: (object: Object3D) => void, click?: (object: Object3D) => void }) => {

    // INITIAL STATES

    let initialGroup: Group = undefined

    if (props.path.endsWith('.glb')) {
        initialGroup = GLTF_MODEL_CACHE[props.path] && GLTF_MODEL_CACHE[props.path].scene
    } else if (props.path.endsWith('.ldr') || props.path.endsWith('.mpd')) {
        initialGroup = LDRAW_MODEL_CACHE[props.path]
    }

    // STATES
    
    const [group, setGroup] = useState<Group>(initialGroup)

    // EFFECTS
    
    useEffect(() => {
        if (props.path) {
            setGroup(undefined)
            if (props.path.endsWith('.glb')) {
                getGLTFModel(props.path).then(gltfModel => setGroup(gltfModel.scene))
            } else if (props.path.endsWith('.ldr') || props.path.endsWith('.mpd')) {
                getLDrawModel(props.path).then(setGroup)
            }
        } else {
            setGroup(undefined)
        }
    }, [props.path])
    
    // RETURN

    return (
        <div className="widget file_view_3d">
            {group ? (
                <>
                    <ModelGraph model={group} highlighted={props.highlighted} marked={props.marked} selected={props.selected} over={props.over} out={props.out} click={props.click}/>
                    <ModelView3D model={group} highlighted={props.highlighted} marked={props.marked} selected={props.selected} over={props.over} out={props.out} click={props.click}/>
                </>
            ) : (
                <img src={LoadIcon} className='icon medium position center animation spin'/>
            )}
        </div>
    )
    
}