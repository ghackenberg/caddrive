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
    // console.log('Materials loaded!')
}).catch(error => {
    console.error(error)
})

export async function loadLDrawModel(path: string, update = empty) {
    const file = await CacheAPI.loadFile(path)
    const text = TEXT_DECODER.decode(file)
    //worker.postMessage({ text, url: path })
    return parseLDrawModel(text, update)
}

export async function loadLDrawPath(path: string, update = empty) {
    const response = await axios.get(path)
    return parseLDrawModel(response.data, update)
}

export async function parseLDrawModel(data: string, update = empty) {
    const model = new Parser().parse(data)
    if (model.files.length > 0) {
        const group = new THREE.Group()
        const total = countParts(model, model.files[0])
        parseModel(group, model, model.files[0], 0, total, update)
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
            parseModel(group, model, model, 0, total, update)
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

async function parseModel(group: THREE.Group, context: Model, model: Model, loaded: number, total: number, update = empty) {
    for (const reference of model.references) {

        if (reference.file.endsWith('.dat')) {

            // Load part

            const submodel = await parseFull(reference.line)
            
            group.add(submodel.children[0])

            loaded++

            update(reference.file, loaded, total)

            await pause(5)

        } else if (reference.file in context.fileIndex) {

            // Load submodel

            const submodel = context.fileIndex[reference.file]

            const child = new THREE.Group()

            child.position.set(reference.position.x, reference.position.y, reference.position.z)
            // TODO Set rotation

            group.add(child)

            // Continue loading submodel
            loaded = await parseModel(child, context, submodel, loaded, total, update)
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