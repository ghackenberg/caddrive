import { Group, LineSegments, LoadingManager, Mesh, Object3D } from "three"
import { LDrawLoader } from "three/examples/jsm/loaders/LDrawLoader"

import { FileManager } from "../managers/file"

const TEXT_DECODER = new TextDecoder()

const LOADING_MANAGER = new LoadingManager().setURLModifier(url => {
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

function fixMaterials(object: Object3D, indent = 0) {
    if (object.type == 'Mesh') {
        const mesh = object as Mesh
        mesh.material = LDRAW_LOADER.getMaterial(`${mesh.material}`)
    } else if (object.type == 'LineSegments') {
        const line = object as LineSegments
        line.material = LDRAW_LOADER.getMaterial(`${line.material}`)
    }
    for (const child of object.children) {
        fixMaterials(child, indent + 1)
    }
}

export async function loadLDrawModel(path: string) {
    const file = await FileManager.getFile(path)
    return parseLDrawModel(TEXT_DECODER.decode(file))
}

export async function parseLDrawModel(data: string) {
    return new Promise<Group>(resolve => {
        LDRAW_LOADER.parse(data, group => {
            // Fix coordinates
            group.rotation.x = Math.PI
            // Fix materials
            fixMaterials(group)
            // Resolve
            resolve(group)
        })
    })
}