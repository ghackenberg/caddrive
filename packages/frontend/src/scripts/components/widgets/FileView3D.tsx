import * as React from 'react'
import { useEffect, useState } from 'react'

import { Group, Object3D } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { loadGLTFModel } from '../../loaders/gltf'
import { loadLDrawModel } from '../../loaders/ldraw'
import { computePath } from '../../functions/path'
import { ModelGraph } from './ModelGraph'
import { ModelView3D } from './ModelView3D'

import LoadIcon from '/src/images/load.png'

type Callback = () => void

const GLTF_MODEL_CACHE: {[path: string]: GLTF} = {}
const LDRAW_MODEL_CACHE: {[path: string]: Group} = {}
const LDRAW_UPDATE_CACHE: {[path: string]: Callback[]} = {}

async function getGLTFModel(path: string) {
    if (!(path in GLTF_MODEL_CACHE)) {
        GLTF_MODEL_CACHE[path] = await loadGLTFModel(path)
    }
    return GLTF_MODEL_CACHE[path]

}

function trackLDrawModel(path: string, callback: () => void) {
    // Subscribe
    if (!(path in LDRAW_UPDATE_CACHE)) {
        LDRAW_UPDATE_CACHE[path] = []
    }
    LDRAW_UPDATE_CACHE[path].push(callback)
    // Unsubscribe
    return () => {
        LDRAW_UPDATE_CACHE[path].splice(LDRAW_UPDATE_CACHE[path].indexOf(callback), 1)
    }
}

async function getLDrawModel(path: string) {
    if (!(path in LDRAW_MODEL_CACHE)) {
        LDRAW_MODEL_CACHE[path] = await loadLDrawModel(path, () => {
            for (const callback of LDRAW_UPDATE_CACHE[path] || []) {
                callback()
            }
        })
    }
    return LDRAW_MODEL_CACHE[path]
}

export function clearModel(path: string) {
    if (path in GLTF_MODEL_CACHE) {
        delete GLTF_MODEL_CACHE[path]
    } else if (path in LDRAW_MODEL_CACHE) {
        delete LDRAW_MODEL_CACHE[path]
    }
}

export const FileView3D = (props: { path: string, mouse: boolean, highlighted?: string[], marked?: string[], selected?: string[], over?: (object: Object3D) => void, out?: (object: Object3D) => void, click?: (object: Object3D) => void }) => {

    // CONSTANTS

    const over = props.over || function(object) {
        setSelected([computePath(object)])
    }
    const out = props.out || function() {
        setSelected([])
    }

    // INITIAL STATES

    let initialGroup: Group = undefined

    if (props.path.endsWith('.glb')) {
        initialGroup = GLTF_MODEL_CACHE[props.path] && GLTF_MODEL_CACHE[props.path].scene
    } else if (props.path.endsWith('.ldr') || props.path.endsWith('.mpd')) {
        initialGroup = LDRAW_MODEL_CACHE[props.path]
    }

    // STATES
    
    // Entities
    const [group, setGroup] = useState<Group>(initialGroup)
    
    // Interactions
    const [toggle, setToggle] = useState(false)
    const [selected, setSelected] = useState<string[]>(props.selected)

    // EFFECTS

    useEffect(() => {
        return trackLDrawModel(props.path, () => {
            const newGroup = new Group().add(LDRAW_MODEL_CACHE[props.path])
            setGroup(newGroup)
        })
    }, [props.path])
    
    useEffect(() => {
        let exec = true
        if (props.path) {
            setGroup(undefined)
            if (props.path.endsWith('.glb')) {
                getGLTFModel(props.path).then(gltfModel => exec && setGroup(gltfModel.scene))
            } else if (props.path.endsWith('.ldr') || props.path.endsWith('.mpd')) {
                getLDrawModel(props.path).then(group => exec && setGroup(group))
            }
        } else {
            setGroup(undefined)
        }
        return () => { exec = false }
    }, [props.path])

    useEffect(() => { setSelected(props.selected) }, [props.selected])
    
    // RETURN

    return (
        <div className={`widget file_view_3d ${toggle ? 'toggle' : ''}`}>
            {group ? (
                <>
                    <ModelGraph model={group} highlighted={props.highlighted} marked={props.marked} selected={selected} over={over} out={out} click={props.click}/>
                    <ModelView3D model={group} highlighted={props.highlighted} marked={props.marked} selected={selected} over={over} out={out} click={props.click}/>
                    <a onClick={() => setToggle(!toggle)} className='button fill lightgray'>
                        <span/>
                    </a>
                </>
            ) : (
                <img src={LoadIcon} className='icon medium position center animation spin'/>
            )}
        </div>
    )
    
}