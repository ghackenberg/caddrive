import axios from "axios"
import * as THREE from "three"
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader'

import { Model, Parser } from "productboard-ldraw"

import { CacheAPI } from "../clients/cache"
//import { worker } from "../worker"

const empty = () => {/**/}

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
        setTimeout(() => parseReference(group, model, model.files[0], 0, update), 1)
        return group
    } else {
        if (model.shapes.length > 0) {
            return parseFull(data)
        } else {
            const group = new THREE.Group()
            setTimeout(() => parseReference(group, model, model, 0, update), 1)
            return group
        }
    }
}

function parseReference(group: THREE.Group, context: Model, model: Model, index: number, update = empty, finish = empty) {
    if (index < model.references.length) {

        const reference = model.references[index]

        if (reference.file.endsWith('.dat')) {

            // Load part

            parseFull(reference.line).then(child => {
                group.add(child)
                update() // Notify
                setTimeout(() => parseReference(group, context, model, index + 1, update, finish), 1)
            })

        } else if (reference.file in context.fileIndex) {

            // Load submodel

            const submodel = context.fileIndex[reference.file]

            const child = new THREE.Group()

            child.position.set(reference.position.x, reference.position.y, reference.position.z)
            // TODO Set position
            // TODO Set rotation

            group.add(child)

            // Continue loading submodel
            parseReference(child, context, submodel, 0, update, () => {
                // Continue loading parent model
                setTimeout(() => parseReference(group, context, model, index + 1, update, finish), 1)
            })
        } else {

            // Omit reference

            parseReference(group, context, model, index + 1, update, finish)

        }
    } else {
        finish()
    }
}

function parseFull(data: string) {
    return new Promise<THREE.Group>(resolve => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (LDRAW_LOADER as any).parse(data, (group: THREE.Group) => {
            // Fix coordinates
            group.rotation.x = Math.PI
            // Resolve
            resolve(group)
        })
    })
}