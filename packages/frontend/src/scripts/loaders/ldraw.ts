import axios from "axios"
import * as THREE from "three"
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader'

import { Model, Parser } from "productboard-ldraw"

import { CacheAPI } from "../clients/cache"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const empty = (_part: string, _loaded: number, _total: number) => {/**/}

const TEXT_DECODER = new TextDecoder()

const LOADING_MANAGER = new THREE.LoadingManager().setURLModifier(url => {
    if (url.indexOf('/') == -1) {
        return `/rest/parts/${url}`
    } else {
        return `/rest/parts/${url.substring(url.lastIndexOf('/') + 1)}`
    }
})

const LDRAW_LOADER = new LDrawLoader(LOADING_MANAGER)

LDRAW_LOADER.preloadMaterials('/rest/parts/LDConfig.ldr').then(() => {
    console.log('Materials loaded!')
}).catch(error => {
    console.error(error)
})

export async function loadLDrawModel(path: string, update = empty) {
    const file = await CacheAPI.loadFile(path)
    const text = TEXT_DECODER.decode(file)
    return parseLDrawModel(path, text, update)
}

const LDRAW_PAUSE: {[path: string]: boolean} = {}
const LDRAW_RESUME: {[path: string]: () => void} = {}
const LDRAW_ACTIVE: {[path: string]: () => Promise<void>} = {}

export function pauseLoadLDrawPath(path: string) {
    LDRAW_PAUSE[path] = true
}

export function resumeLoadLDrawPath(path: string) {
    LDRAW_PAUSE[path] = false

    // Resume running load process
    LDRAW_RESUME[path] && LDRAW_RESUME[path]()
}

export async function loadLDrawPath(path: string, update = empty) {
    const response = await axios.get(path)

    return parseLDrawModel(path, response.data, update)
}

export async function parseLDrawModel(path: string, data: string, update = empty) {
    LDRAW_PAUSE[path] = false

    LDRAW_ACTIVE[path] = async () => {
        if (LDRAW_PAUSE[path]) {
            // Wait for load process to be resumed
            return new Promise<void>(resolve => {
                LDRAW_RESUME[path] = resolve
            })
        } else {
            // Continue load process
            return
        }
    }

    const model = new Parser().parse(data)

    if (model.files.length > 0) {
        const group = new THREE.Group()
        const total = countParts(model, model.files[0])
        parseModel(path, group, model, model.files[0], 0, total, update)
        group.rotation.x = Math.PI
        return group
    } else {
        if (model.shapes.length > 0) {
            const group = await parseFull(data)
            group.rotation.x = Math.PI
            return group
        } else {
            const group = new THREE.Group()
            const total = countParts(model, model)
            parseModel(path, group, model, model, 0, total, update)
            group.rotation.x = Math.PI
            return group
        }
    }
}

async function pause(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds)
    })
}

function countParts(context: Model, model: Model) {
    let count = 0

    for (const reference of model.references) {
        if (reference.file.endsWith('.dat')) {
            count++
        } else if (reference.file in context.fileIndex) {
            count += countParts(context, context.fileIndex[reference.file])
        }
    }

    return count
}

async function parseModel(path: string, group: THREE.Group, context: Model, model: Model, loaded: number, total: number, update = empty) {

    update(undefined, loaded, total)

    for (const reference of model.references) {

        // Check if load process is active and wait, if necessary, for load process to be resumed
        await LDRAW_ACTIVE[path]()

        if (reference.file.endsWith('.dat')) {

            // Load part

            const submodel = await parseFull(reference.line)
            
            group.add(submodel.children[0])

            loaded++

            update(reference.file, loaded, total)

            await pause(0)

        } else if (reference.file in context.fileIndex) {

            // Load submodel

            const submodel = context.fileIndex[reference.file]

            const child = new THREE.Group()

            child.position.set(reference.position.x, reference.position.y, reference.position.z)
            // TODO Set rotation

            group.add(child)

            // Continue loading submodel
            loaded = await parseModel(path, child, context, submodel, loaded, total, update)
        }
    }

    return loaded
}

function parseFull(data: string) {
    return new Promise<THREE.Group>(resolve => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (LDRAW_LOADER as any).parse(data, (group: THREE.Group) => {
            // Resolve
            resolve(group)
        })
    })
}