import * as React from 'react'
import { useEffect, useState } from 'react'

import { Group, Object3D } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

import { loadFBXModel } from '../../loaders/fbx'
import { loadGLTFModel } from '../../loaders/gltf'
import { loadLDrawModel, pauseLoadLDrawPath, resumeLoadLDrawPath } from '../../loaders/ldraw'
import { loadPLYModel } from '../../loaders/ply'
import { loadSTLModel } from '../../loaders/stl'
import { computePath } from '../../functions/path'
import { ModelGraph } from './ModelGraph'
import { ModelView3D } from './ModelView3D'

import LoadIcon from '/src/images/load.png'

type Callback = (part: string, loaded: number, total: number) => void

const STL_MODEL_CACHE: {[path: string]: Group} = {}
const PLY_MODEL_CACHE: {[path: string]: Group} = {}
const FBX_MODEL_CACHE: {[path: string]: Group} = {}
const GLTF_MODEL_CACHE: {[path: string]: GLTF} = {}

const LDRAW_MODEL_CACHE: {[path: string]: Group} = {}
const LDRAW_LOADED_CACHE: {[path: string]: number} = {}
const LDRAW_TOTAL_CACHE: {[path: string]: number} = {}
const LDRAW_UPDATE_CACHE: {[path: string]: Callback[]} = {}

async function getSTLModel(path: string) {
    if (!(path in STL_MODEL_CACHE)) {
        STL_MODEL_CACHE[path] = await loadSTLModel(path)
    }
    return STL_MODEL_CACHE[path]
}

async function getPLYModel(path: string) {
    if (!(path in PLY_MODEL_CACHE)) {
        PLY_MODEL_CACHE[path] = await loadPLYModel(path)
    }
    return PLY_MODEL_CACHE[path]
}

async function getFBXModel(path: string) {
    if (!(path in FBX_MODEL_CACHE)) {
        FBX_MODEL_CACHE[path] = await loadFBXModel(path)
    }
    return FBX_MODEL_CACHE[path]
}

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

        if (LDRAW_UPDATE_CACHE[path].length == 0) {
            pauseLoadLDrawPath(path)
        }
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
    } else {
        resumeLoadLDrawPath(path)
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

    if (props.path.endsWith('.stl')) {
        initialGroup = STL_MODEL_CACHE[props.path]
    } else if (props.path.endsWith('.ply')) {
        initialGroup = PLY_MODEL_CACHE[props.path]
    } else if (props.path.endsWith('.fbx')) {
        initialGroup = FBX_MODEL_CACHE[props.path]
    } else if (props.path.endsWith('.glb')) {
        initialGroup = GLTF_MODEL_CACHE[props.path] && GLTF_MODEL_CACHE[props.path].scene
    } else if (props.path.endsWith('.ldr') || props.path.endsWith('.mpd')) {
        initialGroup = LDRAW_MODEL_CACHE[props.path]
    }

    const initialLoaded = (props.path.endsWith('.ldr') || props.path.endsWith('.mpd')) && LDRAW_LOADED_CACHE[props.path]
    const initialTotal = (props.path.endsWith('.ldr') || props.path.endsWith('.mpd')) && LDRAW_TOTAL_CACHE[props.path]
    const initialUpdate = Date.now()

    // STATES
    
    // Entities
    const [group, setGroup] = useState<Group>(initialGroup)
    const [loaded, setLoaded] = useState<number>(initialLoaded)
    const [total, setTotal] = useState<number>(initialTotal)
    const [update, setUpdate] = useState<number>(initialUpdate)
    
    // Interactions
    const [toggle, setToggle] = useState(false)
    const [selected, setSelected] = useState<string[]>(props.selected)

    // EFFECTS

    useEffect(() => {
        if (props.path) {
            setLoaded(LDRAW_LOADED_CACHE[props.path])
            setTotal(LDRAW_TOTAL_CACHE[props.path])
            setUpdate(Date.now())
            return trackLDrawModel(props.path, (_part, loaded, total) => {
                setLoaded(loaded)
                setTotal(total)
                setUpdate(Date.now())
            })
        } else {
            return () => {/**/}
        }
    }, [props.path])
    
    useEffect(() => {
        let exec = true
        if (props.path) {
            setGroup(undefined)
            if (props.path.endsWith('.stl')) {
                getSTLModel(props.path).then(group => exec && setGroup(group))
            } else if (props.path.endsWith('.ply')) {
                getPLYModel(props.path).then(group => exec && setGroup(group))
            } else if (props.path.endsWith('.fbx')) {
                getFBXModel(props.path).then(group => exec && setGroup(group))
            } else if (props.path.endsWith('.glb')) {
                getGLTFModel(props.path).then(model => exec && setGroup(model.scene))
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
                    {loaded != total ? (
                        <div className='widget model_graph'>
                            Loading ...
                        </div>
                    ) : (
                        <ModelGraph model={group} highlighted={props.highlighted} marked={props.marked} selected={selected} over={over} out={out} click={props.click}/>
                    )}
                    
                    {loaded != total ? (
                        <ModelView3D model={group} update={update}/>
                    ) : (
                        <ModelView3D model={group} update={update} highlighted={props.highlighted} marked={props.marked} selected={selected} over={over} out={out} click={props.click}/>
                    )}
                    
                    {loaded != total && (
                        <div className='progress_bar'>
                            <div className='indicator' style={{width: `${Math.floor(loaded / total * 100)}%`}}></div>
                            <div className='text'>{Math.floor(loaded / total * 100)}%</div>
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