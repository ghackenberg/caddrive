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

export const LDRAW_LOADER = new LDrawLoader(LOADING_MANAGER)

LDRAW_LOADER.smoothNormals = false

export const MATERIAL_LOADING = LDRAW_LOADER.preloadMaterials('/rest/parts/LDConfig.ldr').then(() => {
    console.log('Materials loaded!')
    //console.log(LDRAW_LOADER.materials)
    //console.log(LDRAW_LOADER.materialsLibrary)
}).catch(error => {
    console.error(error)
})

export async function getMaterials() {
    await MATERIAL_LOADING
    return LDRAW_LOADER.materials
}

export function getMaterialColor(material: THREE.Material) {
    if ('color' in material && material.color instanceof THREE.Color) {
        const r = Math.round(material.color.r * 255)
        const g = Math.round(material.color.g * 255)
        const b = Math.round(material.color.b * 255)
        return `rgb(${r},${g},${b})`
    } else {
        throw 'Material type not supported!'
    }
}

export function getObjectMaterialCode(object: THREE.Object3D): string {
    if (object instanceof THREE.Mesh) {
        return object.material.userData.code
    } else {
        for (const child of object.children) {
            try {
                return getObjectMaterialCode(child)
            } catch (e) {
                // ignore
            }
        }
    }
    throw 'Material not found!'
}

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

export async function parseLDrawModel(path: string, data: string, update = empty, asynchron = true) {
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

    if (asynchron && model.files.length > 0) {
        const group = new THREE.Group()
        const total = countParts(model, model.files[0])
        parseModel(path, group, model, model.files[0], 0, total, update)
        group.rotation.x = Math.PI
        return group
    } else {
        if (!asynchron || model.shapes.length > 0) {
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

async function pause(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds)
    })
}

async function parseModel(path: string, group: THREE.Group, context: Model, model: Model, loaded: number, total: number, update = empty, time = Date.now()) {

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

        } else if (reference.file in context.fileIndex) {

            // Load submodel

            const submodel = context.fileIndex[reference.file]

            const child = new THREE.Group()

            child.userData = {
                name: reference.file
            }

            const matrix = new THREE.Matrix4().set(
                reference.orientation.a, reference.orientation.b, reference.orientation.c, reference.position.x,
                reference.orientation.d, reference.orientation.e, reference.orientation.f, reference.position.y,
                reference.orientation.g, reference.orientation.h, reference.orientation.i, reference.position.z,
                0, 0, 0, 1
            )

            const position = new THREE.Vector3()
            const quaternion = new THREE.Quaternion()
            const scale = new THREE.Vector3()

            matrix.decompose(position, quaternion, scale)

            child.position.copy(position)
            child.quaternion.copy(quaternion)
            child.scale.copy(scale)

            group.add(child)

            // Continue loading submodel
            const result = await parseModel(path, child, context, submodel, loaded, total, update, time)

            loaded = result.loaded

            time = result.time
        }

        if (Date.now() - time > 1000 / 60) {
            await pause(0)

            time = Date.now()
        }
    }

    return { loaded, time }
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