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

type Callback = (part: string, loaded: number, total: number) => void

const GLTF_MODEL_CACHE: {[path: string]: GLTF} = {}
const LDRAW_MODEL_CACHE: {[path: string]: Group} = {}
const LDRAW_LOADED_CACHE: {[path: string]: number} = {}
const LDRAW_TOTAL_CACHE: {[path: string]: number} = {}
const LDRAW_UPDATE_CACHE: {[path: string]: Callback[]} = {}

async function getGLTFModel(path: string) {
    if (!(path in GLTF_MODEL_CACHE)) {
        GLTF_MODEL_CACHE[path] = await loadGLTFModel(path)
    }
    return GLTF_MODEL_CACHE[path]

}

function trackLDrawModel(path: string, callback: Callback) {
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
        LDRAW_MODEL_CACHE[path] = await loadLDrawModel(path, (part, loaded, total) => {
            LDRAW_LOADED_CACHE[path] = loaded
            LDRAW_TOTAL_CACHE[path] = total
            for (const callback of LDRAW_UPDATE_CACHE[path] || []) {
                callback(part, loaded, total)
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
    const [loaded, setLoaded] = useState<number>()
    const [total, setTotal] = useState<number>()
    const [update, setUpdate] = useState<number>(Date.now())
    
    // Interactions
    const [toggle, setToggle] = useState(false)
    const [selected, setSelected] = useState<string[]>(props.selected)

    // EFFECTS

    useEffect(() => {
        return trackLDrawModel(props.path, (_part, loaded, total) => {
            setLoaded(loaded)
            setTotal(total)
            setUpdate(Date.now())
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
                    <ModelView3D model={group} update={update} highlighted={props.highlighted} marked={props.marked} selected={selected} over={over} out={out} click={props.click}/>
                    {loaded != total && (
                        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                            <div style={{position: 'absolute', left: '1em', right: '1em', bottom: '1em', backgroundColor: 'white', backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.1))', borderRadius: '0.5em'}}>
                                <div style={{position: 'absolute', zIndex: 0, top: 0, left: 0, bottom: 0, width: `${Math.floor(loaded / total * 100)}%`, backgroundColor: 'orange', backgroundImage: 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0))', borderRadius: '0.5em'}}></div>
                                <div style={{position: 'relative', zIndex: 1, textAlign: 'center'}}>{Math.floor(loaded / total * 100)}%</div>
                            </div>
                        </div>
                    )}
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